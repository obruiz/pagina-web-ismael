/**
 * Worker de Cloudflare para la gestión de contenido de la página web de Ismael
 * Incluye autenticación y CRUD completo para todas las secciones
 */

// Configuración CORS
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type, Authorization',
	'Access-Control-Max-Age': '86400',
};

// Función para manejar respuestas CORS
function corsResponse(response) {
	const newResponse = new Response(response.body, response);
	Object.keys(corsHeaders).forEach(key => {
		newResponse.headers.set(key, corsHeaders[key]);
	});
	return newResponse;
}

// Función para manejar OPTIONS (preflight)
function handleOptions() {
	return new Response(null, {
		status: 204,
		headers: corsHeaders
	});
}

// Función para autenticar requests
async function authenticateRequest(request) {
	const authHeader = request.headers.get('Authorization');
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return null;
	}
	
	const token = authHeader.split(' ')[1];
	// En este caso simple, el token es username:password en base64
	try {
		const decoded = atob(token);
		const [username, password] = decoded.split(':');
		return { username, password };
	} catch {
		return null;
	}
}

// Función para verificar credenciales
async function verifyCredentials(env, username, password) {
	const user = await env.DB.prepare(
		'SELECT * FROM admin_users WHERE username = ? AND password_hash = ?'
	).bind(username, password).first();
	
	return !!user;
}

// Función para crear respuestas JSON
function jsonResponse(data, status = 200) {
	return corsResponse(new Response(JSON.stringify(data), {
		status,
		headers: { 'Content-Type': 'application/json' }
	}));
}

// Función para crear respuestas de error
function errorResponse(message, status = 400) {
	return jsonResponse({ error: message }, status);
}

// Manejador principal del worker
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const method = request.method;
		const path = url.pathname;

		// Manejar preflight requests
		if (method === 'OPTIONS') {
			return handleOptions();
		}

		try {
			// Rutas de autenticación (no requieren auth)
			if (path === '/auth/login' && method === 'POST') {
				return await handleLogin(request, env);
			}

			// Rutas públicas para obtener contenido (no requieren auth)
			if (method === 'GET') {
				switch (path) {
					case '/content/about':
						return await getAbout(env);
					case '/content/experience':
						return await getExperience(env);
					case '/content/projects':
						return await getProjects(env);
					case '/content/contact':
						return await getContact(env);
					case '/content/all':
						return await getAllContent(env);
				}
			}

			// Todas las demás rutas requieren autenticación
			const auth = await authenticateRequest(request);
			if (!auth) {
				return errorResponse('Token de autorización requerido', 401);
			}

			const isValid = await verifyCredentials(env, auth.username, auth.password);
			if (!isValid) {
				return errorResponse('Credenciales inválidas', 401);
			}

			// Rutas protegidas
			switch (path) {
				// Gestión de "Sobre mí"
				case '/admin/about':
					if (method === 'PUT') return await updateAbout(request, env);
					break;

				// Gestión de experiencia
				case '/admin/experience':
					if (method === 'GET') return await getExperience(env);
					if (method === 'POST') return await createExperience(request, env);
					break;
				
				case '/admin/experience/bulk':
					if (method === 'PUT') return await updateExperienceBulk(request, env);
					break;

				// Gestión de proyectos
				case '/admin/projects':
					if (method === 'GET') return await getProjects(env);
					if (method === 'POST') return await createProject(request, env);
					break;
				
				case '/admin/projects/bulk':
					if (method === 'PUT') return await updateProjectsBulk(request, env);
					break;

				// Gestión de contacto
				case '/admin/contact':
					if (method === 'PUT') return await updateContact(request, env);
					break;

				// Rutas dinámicas para editar/eliminar elementos específicos
				default:
					// Manejar rutas como /admin/experience/1, /admin/projects/1
					const pathParts = path.split('/');
					if (pathParts.length === 4 && pathParts[1] === 'admin') {
						const type = pathParts[2];
						const id = parseInt(pathParts[3]);
						
						if (type === 'experience') {
							if (method === 'PUT') return await updateExperienceItem(request, env, id);
							if (method === 'DELETE') return await deleteExperienceItem(env, id);
						} else if (type === 'projects') {
							if (method === 'PUT') return await updateProjectItem(request, env, id);
							if (method === 'DELETE') return await deleteProjectItem(env, id);
						}
					}
					break;
			}

			return errorResponse('Ruta no encontrada', 404);

		} catch (error) {
			console.error('Error en el worker:', error);
			return errorResponse('Error interno del servidor', 500);
		}
	},
};

// FUNCIONES DE AUTENTICACIÓN

async function handleLogin(request, env) {
	const body = await request.json();
	const { username, password } = body;

	if (!username || !password) {
		return errorResponse('Usuario y contraseña requeridos');
	}

	const isValid = await verifyCredentials(env, username, password);
	if (isValid) {
		// Crear token simple (en producción usar JWT)
		const token = btoa(`${username}:${password}`);
		return jsonResponse({
			success: true,
			message: 'Login exitoso',
			token: token
		});
	} else {
		return errorResponse('Credenciales incorrectas', 401);
	}
}

// FUNCIONES PARA CONTENIDO PÚBLICO

async function getAllContent(env) {
	try {
		// Verificar que DB esté disponible
		if (!env.DB) {
			console.error('❌ env.DB no está disponible');
			return errorResponse('Base de datos no configurada', 500);
		}
		
		const about = await env.DB.prepare('SELECT * FROM about ORDER BY id DESC LIMIT 1').first();
		const experience = await env.DB.prepare('SELECT * FROM experience ORDER BY id ASC').all();
		const projects = await env.DB.prepare('SELECT * FROM projects ORDER BY id ASC').all();
		const contact = await env.DB.prepare('SELECT * FROM contact ORDER BY id DESC LIMIT 1').first();

		const result = {
			about: about ? { title: about.title, content: about.content } : null,
			experience: {
				title: 'Experiencia Profesional',
				items: experience.results || []
			},
			projects: {
				title: 'Proyectos Destacados',
				items: projects.results || []
			},
			contact: contact ? {
				title: contact.title,
				description: contact.description,
				email: contact.email,
				buttonText: contact.button_text
			} : null
		};
		
		return jsonResponse(result);
	} catch (error) {
		console.error('❌ Error en getAllContent:', error);
		return errorResponse(`Error al obtener contenido: ${error.message}`, 500);
	}
}

async function getAbout(env) {
	const about = await env.DB.prepare('SELECT * FROM about ORDER BY id DESC LIMIT 1').first();
	return jsonResponse(about ? { title: about.title, content: about.content } : null);
}

async function getExperience(env) {
	const experience = await env.DB.prepare('SELECT * FROM experience ORDER BY id ASC').all();
	return jsonResponse({
		title: 'Experiencia Profesional',
		items: experience.results || []
	});
}

async function getProjects(env) {
	const projects = await env.DB.prepare('SELECT * FROM projects ORDER BY id ASC').all();
	return jsonResponse({
		title: 'Proyectos Destacados',
		items: projects.results || []
	});
}

async function getContact(env) {
	const contact = await env.DB.prepare('SELECT * FROM contact ORDER BY id DESC LIMIT 1').first();
	return jsonResponse(contact ? {
		title: contact.title,
		description: contact.description,
		email: contact.email,
		buttonText: contact.button_text
	} : null);
}

// FUNCIONES PARA ADMINISTRACIÓN

async function updateAbout(request, env) {
	const body = await request.json();
	const { title, content } = body;

	if (!title || !content) {
		return errorResponse('Título y contenido requeridos');
	}

	// Eliminar registro anterior y crear uno nuevo
	await env.DB.prepare('DELETE FROM about').run();
	await env.DB.prepare(
		'INSERT INTO about (title, content) VALUES (?, ?)'
	).bind(title, content).run();

	return jsonResponse({ success: true, message: 'Información actualizada correctamente' });
}

async function createExperience(request, env) {
	const body = await request.json();
	const { position, company, period, description } = body;

	if (!position || !company || !period || !description) {
		return errorResponse('Todos los campos son requeridos');
	}

	const result = await env.DB.prepare(
		'INSERT INTO experience (position, company, period, description) VALUES (?, ?, ?, ?) RETURNING id'
	).bind(position, company, period, description).first();

	return jsonResponse({ success: true, id: result.id, message: 'Experiencia creada correctamente' });
}

async function updateExperienceBulk(request, env) {
	const body = await request.json();
	const { items } = body;

	if (!Array.isArray(items)) {
		return errorResponse('Se esperaba un array de items');
	}

	// Eliminar todas las experiencias y recrearlas
	await env.DB.prepare('DELETE FROM experience').run();

	for (const item of items) {
		await env.DB.prepare(
			'INSERT INTO experience (position, company, period, description) VALUES (?, ?, ?, ?)'
		).bind(item.position, item.company, item.period, item.description).run();
	}

	return jsonResponse({ success: true, message: 'Experiencias actualizadas correctamente' });
}

async function updateExperienceItem(request, env, id) {
	const body = await request.json();
	const { position, company, period, description } = body;

	await env.DB.prepare(
		'UPDATE experience SET position = ?, company = ?, period = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
	).bind(position, company, period, description, id).run();

	return jsonResponse({ success: true, message: 'Experiencia actualizada correctamente' });
}

async function deleteExperienceItem(env, id) {
	await env.DB.prepare('DELETE FROM experience WHERE id = ?').bind(id).run();
	return jsonResponse({ success: true, message: 'Experiencia eliminada correctamente' });
}

async function createProject(request, env) {
	const body = await request.json();
	const { title, description } = body;

	if (!title || !description) {
		return errorResponse('Título y descripción requeridos');
	}

	const result = await env.DB.prepare(
		'INSERT INTO projects (title, description) VALUES (?, ?) RETURNING id'
	).bind(title, description).first();

	return jsonResponse({ success: true, id: result.id, message: 'Proyecto creado correctamente' });
}

async function updateProjectsBulk(request, env) {
	const body = await request.json();
	const { items } = body;

	if (!Array.isArray(items)) {
		return errorResponse('Se esperaba un array de items');
	}

	// Eliminar todos los proyectos y recrearlos
	await env.DB.prepare('DELETE FROM projects').run();

	for (const item of items) {
		await env.DB.prepare(
			'INSERT INTO projects (title, description) VALUES (?, ?)'
		).bind(item.title, item.description).run();
	}

	return jsonResponse({ success: true, message: 'Proyectos actualizados correctamente' });
}

async function updateProjectItem(request, env, id) {
	const body = await request.json();
	const { title, description } = body;

	await env.DB.prepare(
		'UPDATE projects SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
	).bind(title, description, id).run();

	return jsonResponse({ success: true, message: 'Proyecto actualizado correctamente' });
}

async function deleteProjectItem(env, id) {
	await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
	return jsonResponse({ success: true, message: 'Proyecto eliminado correctamente' });
}

async function updateContact(request, env) {
	const body = await request.json();
	const { title, description, email, buttonText } = body;

	if (!title || !description || !email || !buttonText) {
		return errorResponse('Todos los campos son requeridos');
	}

	// Eliminar registro anterior y crear uno nuevo
	await env.DB.prepare('DELETE FROM contact').run();
	await env.DB.prepare(
		'INSERT INTO contact (title, description, email, button_text) VALUES (?, ?, ?, ?)'
	).bind(title, description, email, buttonText).run();

	return jsonResponse({ success: true, message: 'Información de contacto actualizada correctamente' });
}
