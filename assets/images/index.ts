// Add your image assets here and export them as `IMAGES`.
// Example after you add files to `assets/images/`:
// export const IMAGES = {
//   prize1: require('./prize1.png'),
//   prize2: require('./prize2.png'),
//   prize3: require('./prize3.png'),
// };

// For now keep IMAGES empty (null) — the voucher screen will fall back to emojis.
// A small set of hosted images used as placeholders for the UI.
// Replace these URLs with local `require('./myimage.png')` if you add local assets.
export const IMAGES: { [key: string]: string } = {
	hero: 'https://images.unsplash.com/photo-1505691723518-36a0f2b8d6b7?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=0',
	prize1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0',
	prize2: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0',
	prize3: 'https://images.unsplash.com/photo-1526178615686-2a4a6a9c1f87?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0',
};

export default IMAGES;
