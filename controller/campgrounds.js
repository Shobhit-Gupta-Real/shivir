const campGround = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async(req, res) => {
    const allCamps = await campGround.find({});
    res.render('campgrounds/index', { allCamps })

}

module.exports.addground = async(req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const camp = new campGround(req.body)
    camp.geometry = geoData.body.features[0].geometry
    camp.image = req.files.map(f=> ({url: f.path, filename: f.filename}))
    camp.author = req.user._id;
    await camp.save()
    req.flash('success', 'successfully made a new campground')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.edit = async (req, res) => {
    const { id } = req.params
    const camp = await campGround.findById(id)
    if(!camp){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('  /campgrounds')
    }
    res.render('campgrounds/edit', { camp })
}

module.exports.edited = async (req, res) => {
    const { id } = req.params
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
    const imgs = req.files.map(f=> ({url: f.path, filename: f.filename}))
    const camp = await campGround.findByIdAndUpdate(id, { ...req.body })
    camp.geometry = geoData.body.features[0].geometry
    camp.image.push(...imgs)
    await camp.save()
    req.flash('success', 'Updated the campground!')
    res.redirect(`/campgrounds/${camp._id}`)
}

module.exports.delete = async (req, res) => {
    const { id } = req.params
    await campGround.findByIdAndDelete(id)
    req.flash('deleted', 'Campgound deleted!')
    res.redirect('/campgrounds')
}

module.exports.show = async (req, res) => {
    const { id } = req.params
    const camp = await campGround.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error', 'Cannot find that campground!')
        return res.redirect('  /campgrounds')
    }
    res.render('campgrounds/show', {camp})
}

module.exports.remimg = async(req,res)=>{
    const {id, imgid} = req.params
    const camp = await campGround.findById(id)
    await camp.updateOne({$pull: {image: {_id: imgid}}}) //important line
    res.redirect(`/campgrounds/${id}/edit`)
}

