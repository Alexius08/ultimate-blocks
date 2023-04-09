import { useEffect, useState, useRef } from "react";
import { usePrevious } from "../../common";
import Circle from "./CircularCountdown";
import { DigitDisplay } from "./odometer";

const { __ } = wp.i18n;

function useInterval(callback, delay) {
	const savedCallback = useRef();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}

function Timer(props) {
	/*timeLeft: this.remainingTime(),
	numberChange: Array(5).fill("none"), //one for each of the following: week, day, hour, minute, second
	forceRefresh: false,*/
	const {
		color,
		size,
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
		timerStyle,
		forceUpdate,
	} = props;

	const remainingTime = () => props.deadline - Math.floor(Date.now() / 1000);

	const [timeLeft, setTimeLeft] = useState(remainingTime());
	const [timerIsOn, setTimerStatus] = useState(false);
	const [numberChange, setNumberChange] = useState(Array(5).fill("none"));
	const [forceRefresh, setForceRefresh] = useState(false);

	//const ticker = () => setTimeLeft(remainingTime())

	/*useEffect(()=>{
		if (props.deadline - Math.floor(Date.now() / 1000) > 0) {
			this.tick = setInterval(this.ticker, 1000);
		}
	}, [])*/

	useInterval(
		() => {
			setTimeLeft(remainingTime());
		},
		timerIsOn ? 1000 : null
	);

	useEffect(() => {
		setTimerStatus(true);
		return () => {
			setTimerStatus(false);
		};
	}, []);

	useEffect(() => {
		setTimerStatus(props.deadline - Math.floor(Date.now() / 1000) > 0);
	}, [props.deadline]);

	const prevTimeLeft = usePrevious(timeLeft);

	useEffect(() => {
		if (timeLeft <= -1) {
			setTimerStatus(false);
		}

		const timeUnits = ["week", "day", "hour", "minute", "second"];
		//begin old values

		const oldSeconds = prevTimeLeft % 60;

		const oldMinutes = ((prevTimeLeft - oldSeconds) % 3600) / 60;

		let oldHours = (prevTimeLeft - oldMinutes * 60 - oldSeconds) / 3600;
		if (timeUnits.indexOf(largestUnit) < 2) {
			oldHours %= 24;
		}

		let oldDays =
			(prevTimeLeft - oldHours * 3600 - oldMinutes * 60 - oldSeconds) / 86400;
		if (largestUnit === "week") {
			oldDays %= 7;
		}

		const oldWeeks =
			(prevTimeLeft -
				oldDays * 86400 -
				oldHours * 3600 -
				oldMinutes * 60 -
				oldSeconds) /
			604800;

		const oldValues = [oldWeeks, oldDays, oldHours, oldMinutes, oldSeconds];

		//begin new values
		const seconds = timeLeft % 60;
		const minutes = ((timeLeft - seconds) % 3600) / 60;

		let hours = (timeLeft - minutes * 60 - seconds) / 3600;
		if (timeUnits.indexOf(largestUnit) < 2) {
			hours %= 24;
		}

		let days = (timeLeft - hours * 3600 - minutes * 60 - seconds) / 86400;
		if (largestUnit === "week") {
			days %= 7;
		}

		const weeks =
			(timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) /
			604800;

		const newValues = [weeks, days, hours, minutes, seconds];

		if (timerStyle === "Odometer") {
			setNumberChange(
				numberChange.map((_, i) => {
					if (newValues[i] === oldValues[i]) {
						return "none";
					} else if (timeLeft > prevTimeLeft) {
						//increase/decrease should be based on timestamp value instead of value of individual units
						return "increase";
					} else {
						return "decrease";
					}
				})
			);
		}
	}, [timeLeft]);

	useEffect(() => {
		if (forceUpdate) {
			setForceRefresh(true);

			props.finishForcedUpdate();
		}
	}, [forceUpdate]);

	//const { timeLeft, numberChange, forceRefresh } = this.state;

	const timeUnits = ["week", "day", "hour", "minute", "second"];

	//apply value conversion only to days and hours

	const seconds = timeLeft % 60;
	const minutes = ((timeLeft - seconds) % 3600) / 60;

	let hours = (timeLeft - minutes * 60 - seconds) / 3600;

	if (daysEnabled) {
		hours %= 24;
	} else if (weeksEnabled) {
		hours %= 168;
	}

	let days = (timeLeft - hours * 3600 - minutes * 60 - seconds) / 86400;
	if (weeksEnabled) {
		days %= 7;
	}

	const weeks =
		(timeLeft - days * 86400 - hours * 3600 - minutes * 60 - seconds) / 604800;

	const diff =
		timeUnits.indexOf(smallestUnit) - timeUnits.indexOf(largestUnit) + 1;

	const activeUnits = [
		weeksEnabled,
		daysEnabled,
		hoursEnabled,
		minutesEnabled,
		secondsEnabled,
	].filter((a) => a === true);

	const defaultFormat = (
		<p>
			{[
				weeksEnabled ? `${weeks} ${weeksText}` : "",
				daysEnabled ? `${days} ${daysText}` : "",
				hoursEnabled ? `${hours} ${hoursText}` : "",
				minutesEnabled ? `${minutes} ${minutesText}` : "",
				secondsEnabled ? `${seconds} ${secondsText}` : "",
			].join(" ")}
		</p>
	);

	const circularFormatValues = [
		...(weeksEnabled
			? [<Circle color={color} size={size} amount={weeks} total={52} />]
			: []),
		...(daysEnabled
			? [<Circle color={color} size={size} amount={days} total={7} />]
			: []),
		...(hoursEnabled
			? [<Circle color={color} size={size} amount={hours} total={24} />]
			: []),
		...(minutesEnabled
			? [<Circle color={color} size={size} amount={minutes} total={60} />]
			: []),
		...(secondsEnabled
			? [<Circle color={color} size={size} amount={seconds} total={60} />]
			: []),
	];

	const circularFormatLabels = [
		...(weeksEnabled ? [<p>{weeksText}</p>] : []),
		...(daysEnabled ? [<p>{daysText}</p>] : []),
		...(hoursEnabled ? [<p>{hoursText}</p>] : []),
		...(minutesText ? [<p>{minutesText}</p>] : []),
		...(secondsText ? [<p>{secondsText}</p>] : []),
	];

	const circularFormat = (
		<div
			className="ub_countdown_circular_container"
			style={{
				gridTemplateColumns: Array(activeUnits.length).fill("1fr").join(" "),
			}}
		>
			{circularFormatValues}
			{circularFormatLabels}
		</div>
	);

	const separator = <span className="ub-countdown-separator">:</span>;

	const odometerLabels = [
		...(weeksEnabled ? [<span>{weeksText}</span>] : []),
		...(daysEnabled ? [<span>{daysText}</span>] : []),
		...(hoursEnabled ? [<span>{hoursText}</span>] : []),
		...(minutesEnabled ? [<span>{minutesText}</span>] : []),
		...(secondsEnabled ? [<span>{secondsText}</span>] : []),
	];

	const odometerValues = [
		...(weeksEnabled
			? [
					<DigitDisplay
						value={weeks}
						numberChange={numberChange[0]}
						stopAnimation={() => {
							setNumberChange(["none", ...numberChange.slice(1)]);
						}}
						forceRefresh={forceRefresh}
						finishForceRefresh={() => {
							setForceRefresh(false);
							setNumberChange(["none", ...numberChange.slice(1)]);
						}}
					/>,
			  ]
			: []),
		...(daysEnabled
			? [
					<DigitDisplay
						value={days}
						maxDisplay={weeksEnabled ? 6 : 0}
						numberChange={numberChange[1]}
						stopAnimation={() => {
							setNumberChange([
								numberChange[0],
								"none",
								...numberChange.slice(2),
							]);
						}}
						forceRefresh={forceRefresh}
						finishForceRefresh={() => {
							setForceRefresh(false);
							setNumberChange([
								numberChange[0],
								"none",
								...numberChange.slice(2),
							]);
						}}
					/>,
			  ]
			: []),
		...(hoursEnabled
			? [
					<DigitDisplay
						value={hours}
						maxDisplay={daysEnabled ? 23 : weeksEnabled ? 167 : 0}
						numberChange={numberChange[2]}
						stopAnimation={() => {
							setNumberChange([
								...numberChange.slice(0, 2),
								"none",
								...numberChange.slice(3),
							]);
						}}
						forceRefresh={forceRefresh}
						finishForceRefresh={() => {
							setForceRefresh(false);
							setNumberChange([
								...numberChange.slice(0, 2),
								"none",
								...numberChange.slice(3),
							]);
						}}
					/>,
			  ]
			: []),
		...(minutesEnabled
			? [
					<DigitDisplay
						value={minutes}
						maxDisplay={59}
						numberChange={numberChange[3]}
						stopAnimation={() => {
							setNumberChange([
								...numberChange.slice(0, 3),
								"none",
								numberChange[4],
							]);
						}}
						forceRefresh={forceRefresh}
						finishForceRefresh={() => {
							setForceRefresh(false);
							setNumberChange([
								...numberChange.slice(0, 3),
								"none",
								numberChange[4],
							]);
						}}
					/>,
			  ]
			: []),
		...(secondsEnabled
			? [
					<DigitDisplay
						value={seconds}
						maxDisplay={59}
						numberChange={numberChange[4]}
						stopAnimation={() => {
							setNumberChange([...numberChange.slice(0, 4), "none"]);
						}}
						forceRefresh={forceRefresh}
						finishForceRefresh={() => {
							setForceRefresh(false);
							setNumberChange([...numberChange.slice(0, 4), "none"]);
						}}
					/>,
			  ]
			: []),
	];

	const odometerFormat = (
		<div>
			<div
				className="ub-countdown-odometer-container"
				style={{
					gridTemplateColumns: Array(activeUnits.length)
						.fill("1fr")
						.join(" auto "),
				}}
			>
				{odometerLabels
					.map((e, i) => (i < odometerLabels.length - 1 ? [e, <span />] : [e]))
					.flat()}
				{odometerValues
					.map((e, i) => (i < odometerValues.length - 1 ? [e, separator] : [e]))
					.flat()}
			</div>
		</div>
	);

	let selectedFormat;

	switch (timerStyle) {
		case "Circular":
			selectedFormat = circularFormat;
			break;
		case "Odometer":
			selectedFormat = odometerFormat;
			break;
		case "Regular":
		default:
			selectedFormat = defaultFormat;
			break;
	}

	return selectedFormat;
}

export default Timer;
