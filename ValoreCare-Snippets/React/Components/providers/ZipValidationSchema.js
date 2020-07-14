import * as Yup from "yup";


const zipValidationSchema = Yup.object().shape({
    zip: Yup.string().matches(/^[0-9]{5}$/, 'Must be exactly 5 digits').required('Required'),
    radius: Yup.string().matches(/^(0|[1-9]\d*)(\.\d+)?$/, 'Must be a number').required('Required'),
});

export {
    zipValidationSchema
};