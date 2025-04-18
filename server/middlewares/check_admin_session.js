module.exports = (req, res, next) => {

    if (req.session.admin_isAuthenticated) {  

        next()
        
    } else {

        res.json({message: "no session", admin_isAuthenticated: req.session.admin_isAuthenticated})

    }

}