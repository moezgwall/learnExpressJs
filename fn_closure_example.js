

// this a function closure example 
// with promise handling 

const setMinAge = (minAge) => {

    return function ageValidator(user) {

        if (!user || !user.age) {
            return Promise.reject(new Error("user not found!"));
        }
        if (user?.age < minAge) {
            return Promise.reject(new Error(`user must be at least ${minAge}`));
        }
        return Promise.resolve(user);
    }
}


const setMinUsername = (minUsername = 6) => {

    return function usernameValidator(user) {
        if (!user || !user.username) {
            return Promise.reject(new Error("user not found!"));
        }
        if (user?.username.length < minUsername) {
            return Promise.reject(new Error(`username must be at least ${minUsername} characters`));
        }

        return Promise.resolve(user);
    }

}



module.exports = { setMinAge, setMinUsername };


