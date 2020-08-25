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

const register = (user, callback) => {
	auth.createUserWithEmailAndPassword(user.email, user.password).then(function(response) {
		console.log('yes', response);
		database.collection('requests').doc(response.user.uid).set({
			id: response.user.uid,
			company: user.company,
			contact: user.contact,
			country: user.country,
			cuisine_type: user.cuisine_type,
			email: user.email,
			first_line_address: user.first_line_address,
			full_name: user.firstname + ' ' + user.lastname,
			functionalities: user.functionalities,
			has_branches: user.has_branches,
			post: user.post,
			registration_date: user.registration_date,
			restaurant_name: user.restaurant_name,
			self_order_count: user.self_order_count,
			state: user.state,
			street: user.street,
			table_reservation_count: user.table_reservation_count,
			takeaway_count: user.takeaway_count,
			town: user.town,
			vat: user.vat,
			lat: user.lat,
			long: user.long,
			is_activated: false
		}).then(function() {
			callback({status: 'Success'});
		}).catch(function(err) {
			callback({status: 'Failure', error: err});
		});
	}).catch(function(error) {
  		// Handle Errors here.
  		var errorCode = error.code;
	  	var errorMessage = error.message;
	  	callback({status: 'Failure', error: error.message});
	});
}

const login = (email, password, callback) => {
	auth.signInWithEmailAndPassword(email, password).then(function(response) {
		callback({status: 'Success', data: response.user});
	}).catch(function(err) {
		callback({status: 'Failure', error: err});
	});
} 

const isLoggedIn = (callback) => {
	auth.onAuthStateChanged(function(user) {
		console.log('user', user);
		if (user) {
			callback({status: 'Success', user: user});
		} else {
			callback({status: 'Failure'});
		}
	});
}

const getRequestById = (id, callback) => {
	database.collection("requests").doc(id).get().then((request) => {
		callback({status: 'Success', request: request.data()});
	});
}

const saveTables = (id, tables, callback) => {
	for (const num in tables) {
		database.collection('requests').doc(id).collection('tables').doc('Table ' + num).set({
			current_guests: 0,
			customer_id: "",
			is_occupied: false,
			max_guests: tables[num],
			order_amount: 0,
			order_id: "",
			order_status: "Empty",
			table_no: num,
			total_items: 0
		})
	}
	callback({status: 'Success'});
}

const storeImage = (refer, imageFile, callback) => {
	console.log(refer, imageFile)
	var upload = storage.ref(refer).put(imageFile);
	upload.on('state_changed', function(snapshot){
	}, function(error){
	  console.error(error);
	}, function() {
	  upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
	    console.log('File available at', downloadURL);
	    callback({status: 'Success', url: downloadURL});
	  });
	});	
}

const updateRequest = (id, fields, callback) => {
	database.collection('requests').doc(id).update(fields).then(function (response) {
		console.log(response);
		callback({status: 'Success'});
	});
}

const getCategory = (id, callback) => {
	database.collection('restaurants').doc(id).collection('menus').orderBy('timestamp', 'desc').get()
	.then((querySnapshot) => {
		let items = [];
		querySnapshot.forEach((doc) => {
			items.push({name: doc.data().name});
		});
		callback({items});
	});
}

const addCategory = (id, name, callback) => {
	database.collection('restaurants').doc(id).collection('menus').doc(name).set({
		name: name,
		timestamp: new Date()
	}).then(function() {
		callback({status: 'Success'});
	});
}

const menuItems = (id, name, callback) => {
	database.collection('restaurants').doc(id).collection('menus').doc(name).collection('items').orderBy('timestamp', 'desc').get()
	.then((querySnapshot) => {
		let items = [];
		querySnapshot.forEach((doc) => {
			items.push(doc.data());
		});
		callback({items});
	});
}

const menuItem = (id, name, title, callback) => {
	database.collection('restaurants').doc(id).collection('menus').doc(name).collection('items').doc(title).get()
	.then((item) => {
		callback({status: 'Success', item: item.data()});
	});	
}

const getIngredients = (callback) => {
	database.collection('ingredients').get()
	.then((querySnapshot) => {
		let items = [];
		querySnapshot.forEach((doc) => {
			items.push(doc.data());
		});
		callback({items});
	});	
}

const addIngredient = (ingredient, callback) => {
	database.collection('ingredient').doc(ingredient).set({
		name: ingredient,
		is_allergent: false
	}).then(function() {
		callback({status: 'Success'});
	})
}

const addItem = (id, category, item, callback) => {
	database.collection('restaurants').doc(id).collection('menus').doc(category).collection('items').doc(item.name).set(item)
	.then(function() {
		callback({status: 'Success'});
	});
}

const deleteFile = (path) => {
	let deleteFile = storage.ref().child(path);
	// Delete the file
	deleteFile.delete().then(function() {
	  // File deleted successfully
	  console.log({status: 'Success'});
	}).catch(function(error) {
		console.log({status: 'Failure'});
	  // Uh-oh, an error occurred!
	});	
}

const deleteItemCollection = (id, category, itemName) => {
	database.collection('restaurants').doc(id).collection('menus').doc(category).collection('items').doc(itemName).delete()
	.then(function() {
	    console.log("Document successfully deleted!");
	}).catch(function(error) {
	    console.error("Error removing document: ", error);
	});
}

const deleteCategoryCollection = (id, category) => {
	database.collection('restaurants').doc(id).collection('menus').doc(category).delete()
	.then(function() {
	    console.log("Document successfully deleted!");
	}).catch(function(error) {
	    console.error("Error removing document: ", error);
	});
}

const logout = (callback) => {
	firebase.auth().signOut().then(function() {
	  callback({status: 'Success'});
	}, function(error) {
	  callback({status: 'Failure'});
	});
}


function validator(field) {
  if (field.validity.valueMissing) {
    field.setCustomValidity('*Required');
    $(field).addClass('error');
    $("span[for='" + $(field).attr('id') + "']").text(field.validationMessage);
    return false;
  } else if (field.validity.typeMismatch || field.validity.patternMismatch) {
    field.setCustomValidity('*Invalid Format');
    $(field).addClass('error');
    $("span[for='" + $(field).attr('id') + "']").text(field.validationMessage);
    return false;
  } else {
    field.setCustomValidity('');
    $(field).removeClass('error');
    $("span[for='" + $(field).attr('id') + "']").text(field.validationMessage);
    return true;
  }
  return true;
}  	