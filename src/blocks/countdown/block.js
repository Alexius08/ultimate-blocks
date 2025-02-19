import icon, {
	RegularCountdownIcon,
	CircularCountdownIcon,
	TickingCountdownIcon,
} from "./icon";

import Timer from "./components";

import { useEffect, useState } from "react";

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { InspectorControls, RichText, PanelColorSettings, BlockControls } =
	wp.blockEditor || wp.editor;
const {
	DateTimePicker,
	PanelBody,
	ToolbarGroup,
	ToolbarButton,
	SelectControl,
	RangeControl,
} = wp.components;
const { withSelect } = wp.data;

function CountdownMain(props) {
	const [forceUpdate, setForceUpdate] = useState(false);

	const {
		isSelected,
		setAttributes,
		block,
		getBlock,
		getClientIdsWithDescendants,
		attributes: {
			blockID,
			style,
			endDate,
			expiryMessage,
			circleColor,
			circleSize,
			messageAlign,
			largestUnit,
			smallestUnit,
		},
	} = props;

	useEffect(() => {
		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({ blockID: block.clientId });
		}
	}, []);

	const timeUnits = ["week", "day", "hour", "minute", "second"];

	return (
		<>
			{isSelected && (
				<>
					<InspectorControls group="settings">
						<PanelBody title={__("Timer expiration")}>
							<DateTimePicker
								currentDate={endDate * 1000}
								onChange={(value) => {
									setAttributes({
										endDate: Math.floor(Date.parse(value) / 1000),
									});
								}}
							/>
						</PanelBody>
						<PanelBody title={__("Displaying unit")} initialOpen={false}>
							<SelectControl
								label={__("Largest unit")}
								value={largestUnit}
								options={timeUnits
									.filter((_, i) => timeUnits.indexOf(smallestUnit) > i)
									.map((timeUnit) => ({
										label: __(timeUnit),
										value: timeUnit,
									}))}
								onChange={(largestUnit) => {
									setAttributes({ largestUnit });
									setForceUpdate(true);
								}}
							/>
							<SelectControl
								label={__("Smallest unit")}
								value={smallestUnit}
								options={timeUnits
									.filter((_, i) => timeUnits.indexOf(largestUnit) < i)
									.map((timeUnit) => ({
										label: __(timeUnit),
										value: timeUnit,
									}))}
								onChange={(smallestUnit) => {
									setAttributes({ smallestUnit });
									setForceUpdate(true);
								}}
							/>
						</PanelBody>
					</InspectorControls>

					{style === "Circular" && (
						<InspectorControls group="styles">
							<PanelBody title={__("Circle style")}>
								<PanelColorSettings
									title={__("Color")}
									initialOpen={true}
									colorSettings={[
										{
											value: circleColor,
											onChange: (colorValue) =>
												setAttributes({ circleColor: colorValue }),
											label: "",
										},
									]}
								/>
								<RangeControl
									label={__("Size")}
									value={circleSize}
									onChange={(circleSize) => setAttributes({ circleSize })}
									min={30}
									max={100}
								/>
							</PanelBody>
						</InspectorControls>
					)}
				</>
			)}
			{isSelected && (
				<BlockControls>
					<ToolbarGroup>
						<ToolbarButton
							isPrimary={style === "Regular"}
							icon={RegularCountdownIcon}
							label={__("Regular")}
							onClick={() => setAttributes({ style: "Regular" })}
						/>
						<ToolbarButton
							isPrimary={style === "Circular"}
							icon={CircularCountdownIcon}
							label={__("Circular")}
							onClick={() => setAttributes({ style: "Circular" })}
						/>
						<ToolbarButton
							isPrimary={style === "Odometer"}
							icon={TickingCountdownIcon}
							label={__("Odometer")}
							onClick={() => setAttributes({ style: "Odometer" })}
						/>
					</ToolbarGroup>
					<ToolbarGroup>
						{["left", "center", "right", "justify"].map((a) => (
							<ToolbarButton
								icon={`editor-${a === "justify" ? a : "align" + a}`}
								label={__(
									(a !== "justify" ? "Align " : "") +
										a[0].toUpperCase() +
										a.slice(1)
								)}
								isActive={messageAlign === a}
								onClick={() => setAttributes({ messageAlign: a })}
							/>
						))}
					</ToolbarGroup>
				</BlockControls>
			)}
			<>
				<Timer
					timerStyle={style}
					deadline={endDate}
					color={circleColor}
					size={circleSize}
					largestUnit={largestUnit}
					smallestUnit={smallestUnit}
					isAnimated={true}
					forceUpdate={forceUpdate}
					finishForcedUpdate={() => setForceUpdate(false)}
				/>
				<RichText
					tagName="div"
					placeholder={__("Text to show after the countdown is over")}
					style={{ textAlign: messageAlign }}
					value={expiryMessage}
					onChange={(text) => setAttributes({ expiryMessage: text })}
					keepPlaceholderOnFocus={true}
				/>
			</>
		</>
	);
}

registerBlockType("ub/countdown", {
	title: __("Countdown"),
	description: __("Add a countdown in your post/pages. Comes with three different styles.", "ultimate-blocks"),
	icon: icon,
	category: "ultimateblocks",
	keywords: [__("Countdown"), __("Timer"), __("Ultimate Blocks")],
	attributes: {
		blockID: {
			type: "string",
			default: "",
		},
		endDate: {
			type: "number",
			default: 60 * (1440 + Math.ceil(Date.now() / 60000)), // 24 hours from Date.now
		},
		style: {
			type: "string",
			default: "Odometer", //available types: Regular, Circular, Odometer
		},
		expiryMessage: {
			type: "string",
			default: "",
		},
		messageAlign: {
			type: "string",
			default: "left",
		},
		circleColor: {
			type: "string",
			default: "#2DB7F5",
		},
		circleSize: {
			type: "number",
			default: 70,
		},
		largestUnit: {
			type: "string",
			default: "week",
		},
		smallestUnit: {
			type: "string",
			default: "second",
		},
	},
	example: {},
	edit: withSelect((select, ownProps) => {
		const { getBlock, getClientIdsWithDescendants } =
			select("core/block-editor") || select("core/editor");

		return {
			block: getBlock(ownProps.clientId),
			getBlock,
			getClientIdsWithDescendants,
		};
	})(CountdownMain),

	save: () => null,
});
