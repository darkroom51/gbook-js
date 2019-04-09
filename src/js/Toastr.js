class Toastr {
	constructor() {
		this.toastr = document.querySelector('.toastr');
		this.toastr.addEventListener('click', this.closeToastr.bind(this));
	}

	openToastr(type, message) {
		this.toastr.classList.add('show', type);
		this.toastr.innerHTML = `<h2>${message}...</h2>`;
	}

	closeToastr(e) {
		this.toastr.classList.remove('show', 'loading', 'error');
		this.toastr.innerHTML = '';
	}
}

export const toastr = new Toastr();