import * as Yup from "yup";


const textValidationSchema = Yup.object().shape({
    subject: Yup.string().max(50, 'You are over the 50 character limit').required('Required'),
    text: Yup.string().max(3000, 'You are over the 3000 character limit').required('Required'),
});

export {
    textValidationSchema
};