$('.logOut').on('click', function(e){
	e.preventDefault();
	console.log('hi')
	$.ajax({
		url: '/log-out',
		method: 'DELETE'
	})
	.then( data => {
    window.location.reload()
   })
})

