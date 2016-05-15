/** @babel */

class HtmlRendererHelper {
	createContainer(cssClass = null, textContent = null) {
		const element = document.createElement('div');

		if (cssClass) {
			element.classList.add(cssClass);
		}

		if (textContent) {
			element.textContent = textContent;
		}

		return element;
	}

	createImage(src, cssClass = null) {
		const img = document.createElement('img');
		img.src = src;
		img.classList.add(cssClass);
		return img;
	}
}

module.exports = HtmlRendererHelper;
