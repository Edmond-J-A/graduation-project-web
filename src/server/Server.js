export const ServerIP = "http://localhost"

export const ToServer = async (path, meth, body, headers) => {
    const resp = await fetch(`${ServerIP}${path}`, {
        method: meth,
        headers: headers,
        body: body,
        credentials: "include",
    })


    return await resp.json()
}