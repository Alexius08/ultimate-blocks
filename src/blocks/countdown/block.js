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
	TextControl,
	ToggleControl,
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
			weeksEnabled,
			weeksText,
			daysEnabled,
			daysText,
			hoursEnabled,
			hoursText,
			minutesEnabled,
			minutesText,
			secondsEnabled,
			secondsText,
		},
	} = props;

	const timeUnits = ["week", "day", "hour", "minute", "second"];

	useEffect(() => {
		if (
			blockID === "" ||
			getClientIdsWithDescendants().some(
				(ID) =>
					"blockID" in getBlock(ID).attributes &&
					getBlock(ID).attributes.blockID === blockID
			)
		) {
			setAttributes({
				blockID: block.clientId,
				weeksEnabled: true,
				daysEnabled: true,
				hoursEnabled: true,
				minutesEnabled: true,
				secondsEnabled: true,
			});
		} else {
			//transition from old system to new system
			if (
				[
					weeksEnabled,
					daysEnabled,
					hoursEnabled,
					minutesEnabled,
					secondsEnabled,
				].filter((a) => a === true).length === 0
			) {
				const largestUnitIndex = timeUnits.indexOf(largestUnit);
				const smallestUnitIndex = timeUnits.indexOf(smallestUnit);

				setAttributes({
					weeksEnabled: largestUnitIndex === 0,
					daysEnabled: largestUnitIndex <= 1 && smallestUnitIndex >= 1,
					hoursEnabled: largestUnitIndex <= 2 && smallestUnitIndex >= 2,
					minutesEnabled: largestUnitIndex <= 3 && smallestUnitIndex >= 3,
					secondsEnabled: smallestUnitIndex === 4,
				});
			}
		}
	}, []);

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
						<PanelBody title={__("Unit display")} initialOpen={false}>
							{/*<SelectControl
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
						/>*/}
							{/**ADD COUNTDOWN TOGGLES HERE */}
							<ToggleControl
								label={"Show weeks"}
								checked={weeksEnabled}
								onChange={() => setAttributes({ weeksEnabled: !weeksEnabled })}
							/>
							{weeksEnabled && (
								<TextControl
									label={__("Custom label for weeks")}
									value={weeksText}
									onChange={(weeksText) => setAttributes({ weeksText })}
								/>
							)}
							<ToggleControl
								label={"Show days"}
								checked={daysEnabled}
								onChange={() => setAttributes({ daysEnabled: !daysEnabled })}
							/>
							{daysEnabled && (
								<TextControl
									label={__("Custom label for days")}
									value={daysText}
									onChange={(daysText) => setAttributes({ daysText })}
								/>
							)}
							<ToggleControl
								label={"Show hours"}
								checked={hoursEnabled}
								onChange={() => setAttributes({ hoursEnabled: !hoursEnabled })}
							/>
							{hoursEnabled && (
								<TextControl
									label={__("Custom label for hours")}
									value={hoursText}
									onChange={(hoursText) => setAttributes({ hoursText })}
								/>
							)}
							<ToggleControl
								label={"Show minutes"}
								checked={minutesEnabled}
								onChange={() =>
									setAttributes({ minutesEnabled: !minutesEnabled })
								}
							/>
							{minutesEnabled && (
								<TextControl
									label={__("Custom label for days")}
									value={minutesText}
									onChange={(minutesText) => setAttributes({ minutesText })}
								/>
							)}
							<ToggleControl
								label={"Show seconds"}
								checked={secondsEnabled}
								onChange={() =>
									setAttributes({ secondsEnabled: !secondsEnabled })
								}
							/>
							{daysEnabled && (
								<TextControl
									label={__("Custom label for days")}
									value={secondsText}
									onChange={(secondsText) => setAttributes({ secondsText })}
								/>
							)}
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
					weeksEnabled={weeksEnabled}
					weeksText={weeksText}
					daysEnabled={daysEnabled}
					daysText={daysText}
					hoursEnabled={hoursEnabled}
					hoursText={hoursText}
					minutesEnabled={minutesEnabled}
					minutesText={minutesText}
					secondsEnabled={secondsEnabled}
					secondsText={secondsText}
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
	description: __("Add a countdown timer", "ultimate-blocks"),
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
		//phase out
		largestUnit: {
			type: "string",
			default: "week",
		},
		smallestUnit: {
			type: "string",
			default: "second",
		},
		//replacements
		weeksEnabled: {
			type: "boolean",
			default: false,
		},
		weeksText: {
			type: "string",
			default: "weeks",
		},
		daysEnabled: {
			type: "boolean",
			default: false,
		},
		daysText: {
			type: "string",
			default: "days",
		},
		hoursEnabled: {
			type: "boolean",
			default: false,
		},
		hoursText: {
			type: "string",
			default: "hours",
		},
		minutesEnabled: {
			type: "boolean",
			default: false,
		},
		minutesText: {
			type: "string",
			default: "minutes",
		},
		secondsEnabled: {
			type: "boolean",
			default: false,
		},
		secondsText: {
			type: "string",
			default: "seconds",
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
