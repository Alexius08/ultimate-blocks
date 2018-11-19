const { InspectorControls } = wp.editor;
const { registerBlockType } = wp.blocks;
const { Icon, TextControl, RangeControl } = wp.components;
const { __ } = wp.i18n;

registerBlockType('ub/gmap', {   
  title: __('Map'),
  icon: 'admin-site',
  category: 'ultimateblocks',
  keywords: [__('Map'),
    __('Ultimate Blocks'),],
  attributes: {
    searchTerm: {
      type: 'string',
      default: 'Mount Everest'
    },
    width: {
      type: 'number',
      default: 500
    },
    height:{
      type: 'number',
      default: 500
    },
    zoomLevel:{
      type: 'number',
      default: 11
    }
  },

  edit(props) {

    const {searchTerm, width, height, zoomLevel} = props.attributes;
    return ([props.isSelected && <InspectorControls key='inspector'>
        <Icon icon="location-alt"/>
        <TextControl
          label = {__("Location")}
          value = {searchTerm}
          onChange = {value => props.setAttributes({searchTerm: value})}
        />
        <Icon icon="search"/>
        <RangeControl
        label={__("Zoom Level")}
        value={ zoomLevel }
        onChange={ value  => props.setAttributes( { zoomLevel: value } ) }
        min={ 1 }
        max={ 19 }
        />
        <Icon icon="image-flip-horizontal"/>
        <TextControl
        label = {__("Width")}
        value = {width}
        onChange = {value => props.setAttributes({width: value})}
        />
        <Icon icon="image-flip-vertical"/>
        <TextControl
        label = {__("Height")}
        value = {height}
        onChange = {value => props.setAttributes({height: value})}
        />
      </InspectorControls>,
    <iframe
      width={width}
      height={height}
      src={`https://maps.google.com/maps?q=${searchTerm}&t=&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`}
      frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
    </iframe>]);
  },

  save(props) {
    const {searchTerm, width, height, zoomLevel} = props.attributes;
    return (<iframe
      width={width}
      height={height}
      src={`https://maps.google.com/maps?q=${searchTerm}&t=&z=${zoomLevel}&ie=UTF8&iwloc=&output=embed`}
      frameborder="0" scrolling="no" marginheight="0" marginwidth="0">
    </iframe>
    );
  }

});

