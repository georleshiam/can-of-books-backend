async function verifyUser(request, response, next) {
    let auth = request.headers.authorization
    if (auth !== undefined) {
        let token = auth.split(" ")[1]
        let headers = {
            Authorization: `Bearer ${token}`
        }
        let response = await axios.get(process.env.AUTH_DOMAIN, { headers: headers })
        request.user = response.data
    }
    next()
}