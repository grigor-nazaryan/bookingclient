export default function showErrorMessage(error, message = "Oops, something went wrong") {
    if (error.response && error.response.data) {
        message = error.response.data.message;
    }
    return message;
}

