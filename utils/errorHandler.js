module.exports = (res, error) => {
    console.error(e)

    res.status(500).json({
        success:false,
        message: 'Что-то пошло не так...'
    })
}