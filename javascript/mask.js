/*nomen: true*/
if (!window.gAlp) {
    window.gAlp = {};
}

window.gAlp.masking = (function(doc, core, config, builder){
    
    var byClass = config.getFeatures('class'),
        byTags = config.getFeatures('tags'),
        getContainer = config.getFeature(byClass, null, 0),
        tgtArea = config.getFeature(byTags, getContainer('wild'), 0),
        tgt = tgtArea('img'),
        
        data = function(src){
            return {
            tag: 'img_1',
            attrs: {
                'class': 'mask',
                alt: 'mask for image',
                src: src[0] + '_mask.' + src[1]
            }
        }
        };
    
    builder.build(data(tgt.src.split('.')), tgt)
                
    
})(document, gAlp.Core, gAlp.Config, gAlp.tagBuilder);

//gAlp.Core.addEvent(window, 'load', window.gAlp.bindEvents);
gAlp.Core.addEvent(window, 'DOMContentLoaded', window.gAlp.masking);