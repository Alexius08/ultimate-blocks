const { InspectorControls } = wp.editor;
const { registerBlockType } = wp.blocks;
const { RangeControl } = wp.components;

import './style.scss';
import './editor.scss';

registerBlockType('ub/rating', {   
    title: 'Rating',
    icon: 'star-half',
    category: 'ultimateblocks',
  
  attributes: {
    starCount: {
      type: 'number',
      default: 5
    },
    selectedStars: {
      type: 'number',
      default: 0
    }
  },

  edit(props) {

    const {starCount, selectedStars} = props.attributes;
    return [props.isSelected && <InspectorControls key="inspectors">
        <RangeControl
          label={'Number of stars'}
          value={starCount}
          onChange={(value) => props.setAttributes({starCount: value,
            selectedStars: (value < selectedStars ? value : selectedStars)})}
          min={5}
          max={10}
          beforeIcon="star-empty"
          allowReset
        />
        <RangeControl
          label={'Number of selected stars'}
          value={selectedStars}
          onChange={(value) => props.setAttributes({selectedStars: value })}
          min={0}
          max={starCount}
          beforeIcon="star-filled"
          allowReset  
        />
    </InspectorControls>,
    <div className="container ub-rating">
      {[...Array(starCount)].map((e, i) =>
      <span key={i} className={i < selectedStars && "selectedStar"}>{String.fromCharCode(i < selectedStars ? 0x2605 : 0x2606)}</span>)}
    </div>];
  },

  save(props) {
    const {starCount, selectedStars} = props.attributes;
    return (
    <div className="ub-rating">
      {[...Array(starCount)].map((e, i) =>
  <span key={i} className={i < selectedStars && "selectedStar"}>{String.fromCharCode(i < selectedStars ? 0x2605 : 0x2606)}</span>)}
    </div>
    );
  }

});

