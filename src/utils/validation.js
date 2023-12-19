const validation = (user) => {
    const validate = {
        isValid: false,
        errors: [],
    }
    if (!user instanceof Object) return;
    if (!(/^[A-Za-z]+$/.test(user.firstName?.trim()))) {
        validate.errors.push({
            name: 'firstName',
            message: '*special characters not allowed'
        })
    }
    if (!(/^[A-Za-z]+$/.test(user.lastName?.trim()))) {
        validate.errors.push({
            name: 'lastName',
            message: '*special characters not allowed'
        })
    }
    if (!user.gender) {
        validate.errors.push({
            name: 'gender',
            message: '*select gender'
        })
    }
    if (!(/^(A|B|AB|O)[+-]$/.test(user.bloodGroup?.trim()))) {
        validate.errors.push({
            name: 'bloodGroup',
            message: '*enter blood group'
        })
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(user.email?.trim()))) {
        validate.errors.push({
            name: 'email',
            message: '*enter correct email'
        })
    }
    if (new Date(user.dob) > new Date()) {
        validate.errors.push({
            name: 'dob',
            message: '*enter dob'
        })
    }
    if (!(user.jobRole?.trim())) {
        validate.errors.push({
            name: 'jobRole',
            message: '*select jobRole group'
        })
    }
    if (user.image === "data:application/octet-stream;base64,") {
        validate.errors.push({
            name: 'image',
            message: '*select image '
        })
    }
    if (!/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/.test(user.phone)) {
        validate.errors.push({
            name: 'phone',
            message: '*enter correct phone'
        })
    }
    return validate;
};
export default validation;