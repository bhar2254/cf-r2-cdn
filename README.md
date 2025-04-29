# R2 CDN Gateway

Welcome to the **R2 CDN Gateway**! 🚀

This Cloudflare Worker-based solution allows you to serve images directly from your Cloudflare R2 bucket to your websites or applications with minimal setup and maximum efficiency. With intelligent caching and fallback logic, it provides a reliable and simple method to handle images at scale.

## How It Works

The R2 CDN Gateway is a Cloudflare Worker that fetches images from your R2 bucket and serves them through a fast CDN. Here's how it works:

1. **Direct Image Fetching**: You can directly fetch images by accessing the path `/images/{image-path}`.
2. **Fallback Logic**: If a specific image is missing, the gateway attempts to fetch a default image. This means you can handle missing images gracefully.
3. **Simple Landing Page**: A simple landing page explains how this system works, providing easy navigation for developers and users.

## Features

- **Fast and Reliable Image Delivery**: Images are fetched from Cloudflare's R2 storage, and served with caching headers for optimal performance.
- **Flexible Fallback Mechanism**: If an image is missing, the system falls back to a default image (or a custom default you provide).
- **Customizable Cache Headers**: Control the caching behavior of images served by the gateway.
- **Simple Setup**: Just a few steps to get it running in your Cloudflare Workers account.

---

## 🚀 Getting Started

Follow these steps to set up the **R2 CDN Gateway** in your Cloudflare Workers account:

### 1. **Create Your Cloudflare Worker**

1. **Install Wrangler (if you haven't already)**:
   Wrangler is Cloudflare's CLI tool for managing Workers.

   ```bash
   npm install -g wrangler
   ```

2. **Create a new Cloudflare Worker project**:
   Use Wrangler to scaffold a new Worker project.

   ```bash
   wrangler generate r2-cdn-gateway
   cd r2-cdn-gateway
   ```

3. **Replace the Default Worker Code**:
   Replace the contents of `src/index.ts` with the code provided in this repository.

### 2. **Set Up Cloudflare R2 Bucket**

1. **Create an R2 Bucket**:
   In your Cloudflare dashboard, navigate to **R2** under the **Storage** section and create a new bucket to store your images.

2. **Upload Your Images**:
   Upload your images to the R2 bucket. You can use the R2 UI or a command-line tool like `r2` to do this.

3. **Set Bucket Permissions**:
   Ensure that your R2 bucket has public read permissions for the images, so they can be accessed via the CDN.

### 3. **Link Your R2 Bucket to the Worker**

1. **Configure your `wrangler.toml` file**:
   Inside your `wrangler.toml`, add the necessary configuration for the R2 bucket. This is where you link the Worker to your Cloudflare R2 bucket.

   ```toml
   name = "r2-cdn-gateway"
   compatibility_date = "2024-04-01"
   main = "src/index.ts"

   [[r2_buckets]]
   binding = "R2_BUCKET"
   bucket_name = "your-r2-bucket-name"
   preview_bucket_name = "your-r2-bucket-name"
   ```

2. **Deploy the Worker**:
   After configuring `wrangler.toml`, deploy your Worker to Cloudflare using the following command:

   ```bash
   wrangler deploy
   ```

---

## 📸 How to Use

Once the Worker is deployed, you can start using it to display content from your R2 bucket.

### Direct Image Access

To fetch and display an image from your R2 bucket, use the following URL format:

```
https://your-worker-subdomain.workers.dev/images/{image-path}
```

Example:
```
https://your-worker-subdomain.workers.dev/images/my-image.jpg
```

### Default Image Fallback

If an image is missing, the system will attempt to fetch a fallback image. The format for this is:

```
https://your-worker-subdomain.workers.dev/def/{default-image-name}/{image-path}
```

Example:
```
https://your-worker-subdomain.workers.dev/def/default/my-missing-image.jpg
```

If no specific default image is found, a global default image (`def/default.webp`) will be served.

---

## 🛠️ Customization

### 1. **Modify Cache Control**

You can adjust the cache settings by modifying the `Cache-Control` header in the code. Currently, it is set to cache images for 1 day (`max-age=86400`). If you'd like to change this, simply adjust the line in `fetchImage`:

```ts
"Cache-Control": "public, max-age=86400", // 1 day
```

### 2. **Change Default Images**

To change the default fallback image, upload a new default image to your R2 bucket and adjust the `fetchWithDefault` function to reflect the new default image path.

```ts
response = await fetchImage(env, "def/your-custom-default.webp");
```

---

## 🔐 Security and Authentication

By default, this gateway serves public images. If you want to restrict access to images in your R2 bucket, consider setting up **signed URLs** for secure access or using authentication methods in Cloudflare Workers.

---

## 💡 Tips and Tricks

- **Dynamic Image Resizing**: You can implement dynamic resizing or transformation of images by integrating with Cloudflare's Image Resizing features. This can help reduce bandwidth and improve loading times.
- **Custom Domain**: Set up a custom domain for your Worker to make the URLs more friendly (e.g., `images.example.com`).
- **Analytics**: Implement logging or analytics to track how frequently different images are requested.

---

## 🔄 Contributing

We welcome contributions! If you have suggestions, improvements, or bug fixes, feel free to open an issue or submit a pull request.

---

## 📜 License

This project is licensed under the MIT License.

Enjoy building with Cloudflare R2 and Workers! Let us know if you need help or have any questions. 🚀

---

This `README.md` gives users clear instructions on how to get started, use the R2 CDN, and customize the solution. It also includes helpful tips and details about the Cloudflare setup process. Let me know if you'd like to adjust anything else!
