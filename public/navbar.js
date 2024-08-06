



document.addEventListener("DOMContentLoaded", function() {


    var searchInput = document.getElementById("nav-search-bar");
    var autocompleteList = document.getElementById("autocomplete-list");

    searchInput.addEventListener("keydown", function(event) {
    	if (event.key === 'Enter')
    	{
    		event.preventDefault();
    		console.log('aa')
    		window.location.href = `http://localhost:3000/search-results?query=${this.value}`;
    	}
    })
    searchInput.addEventListener("input", function() {


        fetch(`http://localhost:3000/search?query=${this.value}`)
        .then(response => response.json())
        .then(data => {

	        autocompleteList.innerHTML = "";

	        for (const id in data){
	        	const doc = data[id]
	            var item = document.createElement("div");
	            item.classList.add("autocomplete-item");
	            item.innerText = doc.title
	            item.style.paddingLeft = '15px';
	            item.style.paddingRight = '15px';
	            item.style.cursor = 'pointer';

	            // Add click event to autocomplete item
	            item.addEventListener("click", function() {
	                searchInput.value = doc.title;
	                autocompleteList.innerHTML = "";
	            });


	            autocompleteList.appendChild(item);
	        }
        }).catch(error => {console.log(error)});

    });

    // Close the autocomplete list when clicking outside
    document.addEventListener("click", function(e) {
        if (e.target !== searchInput) {
            autocompleteList.innerHTML = "";
        }
    });
});