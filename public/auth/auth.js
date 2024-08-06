


document.addEventListener('DOMContentLoaded', (event) => {
	const loginBlock = document.querySelector("#loginBlock")
	const registerBlock = document.querySelector("#registerBlock")

	loginBlock.addEventListener('mouseover', () => {
	    loginBlock.classList.add('bg-secondary-subtle')
	    registerBlock.classList.remove('bg-secondary-subtle')
	 });

	registerBlock.addEventListener('mouseover', () => {
	    registerBlock.classList.add('bg-secondary-subtle')
	   	loginBlock.classList.remove('bg-secondary-subtle')
	 });
});
