// database.collection("users").get().then((querySnapshot) => {
//     querySnapshot.forEach((doc) => {
//         console.log(`${doc.id} => ${doc.data().full_name}`);
//     });
// });


// Get Cuisines from the db
const getCuisines = new Promise(function executor(resolve, reject) {
	database.collection("cuisines").get().then((querySnapshot) => {
		let cuisines = [];
		querySnapshot.forEach((doc) => {
			cuisines.push({id: doc.id, name: doc.data().name});
		});
		resolve(cuisines);
	});
})

const register = (user) => {
	auth.signInWithEmailAndPassword(user.email, user.password).then(function() {
		database.collection('request').add({
			company: user.company,
			contact: user.contact,
			cuisine_type: user.cuisine_type,
			email: user.email,
			first_line_address: user.first_line_address,
			full_name: user.firstname + ' ' + user.lastname,
			functionalities: user.functionalities,
			has_branches: user.has_branches,
			post: user.post,
			registration_date: new Date(),
			restaurant_name: user.restaurant_name,
			self_order_count: user.self_order_count,
			state: user.state,
			street: user.street,
			table_reservation_count: user.table_reservation_count,
			takeaway_count: user.takeaway_count,
			town: user.town,
			vat: user.vat,
			is_activated: false
		}).then(function(docRef) {
			return {status: 'Success', docid: docRed.id};
		}).catch(function(err) {
			return {status: 'Failure', error: err};
		});
	}).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
	  	var errorMessage = error.message;
	  	// ...
	});
}