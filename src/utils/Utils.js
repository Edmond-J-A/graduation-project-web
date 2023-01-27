
export const dataMake = (data) => {
    let res = new FormData()
    for (let key of Object.keys(data)) res.append(key, data[key])
    return res
}