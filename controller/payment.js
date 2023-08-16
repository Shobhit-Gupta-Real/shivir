const {STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY} = process.env
const stripe = require('stripe')(STRIPE_SECRET_KEY)

module.exports.paymenton = async(req,res)=>{
    try{
        stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Sandeep Sharma',
        address: {
            line1: '115, Vikas Nagar',
            postal_code: '281001',
            city: 'Mathura',
            state: 'Uttar Pradesh',
            country: 'India',
        }
    })
    .then((customer)=>{
        return stripe.charges.create({
            amount: req.body.amount,
            description: req.body.productname,
            currency: 'INR',
            customer: customer.id
        });
    })
    .then((charge)=>{
        res.redirect('/payment/success')
    })
    .catch((err)=>{
        req.flash('success', 'Payment completed!')
        res.redirect('/campgrounds')
    });
}catch(error){
    console.log(error.message)
}
}

module.exports.success = async(req,res)=>{
    res.render('users/psuccess')
}