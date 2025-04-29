export interface Env {
	R2_BUCKET: R2Bucket;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;

		if (path === "/" || path === "/index.html") {
			return serveLandingPage();
		}

		if (path.startsWith("/images/")) {
			const imagePath = path.slice("/images/".length);
			return await fetchImage(env, imagePath);
		}

		if (path.startsWith("/def/")) {
			const [, , defaultImage, ...imagePathParts] = path.split("/");
			const imagePath = imagePathParts.join("/");
			return await fetchWithDefault(env, imagePath, defaultImage);
		}

		return new Response("Invalid request", { status: 400 });
	},
};

// Serve landing page
function serveLandingPage(): Response {
	const html = `<!DOCTYPE html>
<html>
<head>
	<title>R2 CDN Gateway</title>
	<style>
		body { font-family: sans-serif; padding: 2rem; background: #f9f9f9; }
		h1 { color: #2c3e50; }
		code { background: #eef; padding: 0.2rem 0.4rem; border-radius: 4px; }
	</style>
</head>
<body>
	<h1>Welcome to the R2 CDN Gateway</h1>
	<p>This Worker serves images from a Cloudflare R2 bucket via:</p>
	<ul>
		<li><code>/images/&lt;path&gt;</code> – Direct image path</li>
		<li><code>/def/&lt;default&gt;/&lt;path&gt;</code> – With fallback logic</li>
	</ul>
</body>
</html>`;
	return new Response(html, {
		headers: { "Content-Type": "text/html; charset=UTF-8" },
	});
}

// Fetch image from R2
async function fetchImage(env: Env, imagePath: string): Promise<Response | null> {
	try {
		const object = await env.R2_BUCKET.get(imagePath);
		if (!object) return null;

		const contentType = getContentType(imagePath) || "application/octet-stream";
		return new Response(object.body, {
			headers: {
				"Content-Type": contentType,
				"Cache-Control": "public, max-age=86400",
			},
		});
	} catch (err) {
		return new Response("Error fetching image", { status: 500 });
	}
}

// Fallback image fetch
async function fetchWithDefault(env: Env, imagePath: string, defaultImage: string): Promise<Response> {
	let response = await fetchImage(env, imagePath);

	if (!response) {
		const yearRegex = /(\/)\d{4}(\/|$)/;
		if (yearRegex.test(imagePath)) {
			const newPath = imagePath.replace(yearRegex, "$1");
			response = await fetchImage(env, newPath);
		}
	}

	if (!response) {
		response = await fetchImage(env, `def/${defaultImage}.webp`);
	}

	if (!response) {
		response = await fetchImage(env, "def/default.webp");
	}

	return response || new Response("Default image not found", { status: 404 });
}

// Guess MIME type from extension
function getContentType(path: string): string | null {
	const ext = path.split(".").pop()?.toLowerCase();
	const types: Record<string, string> = {
		webp: "image/webp",
		jpg: "image/jpeg",
		jpeg: "image/jpeg",
		png: "image/png",
		gif: "image/gif",
		svg: "image/svg+xml",
		ico: "image/x-icon",
	};

	return ext ? types[ext] || null : null;
}
