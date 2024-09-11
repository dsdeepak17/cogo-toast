import React, { useState, useEffect } from 'react';
import { string, number, bool, func, shape, node, oneOfType } from 'prop-types';

import Icons from './Icons';
import { CTOptions } from '../../index.d';

const colors = {
	success: '#6EC05F',
	info: '#1271EC',
	warn: '#FED953',
	error: '#D60A2E',
	loading: '#0088ff',
};

type CToastProps = CTOptions & {
	id: number;
	type: string;
	text: string;
	show: boolean;
	onHide: Function;
	onClick: Function;
	hideAfter: number;
};

const Toast: React.FC<CToastProps> = ({
	id,
	type,
	text,
	show = true,
	onHide,
	onClick,
	hideAfter = 3,
	heading,
	position = 'top-center',
	renderIcon,
	bar = {},
	role = 'status',
}) => {
	const place = position.includes('bottom') ? 'Bottom' : 'Top';
	const marginType = `margin${place}`;

	const className = ['ct-toast', onClick ? ' ct-cursor-pointer' : '', `ct-toast-${type}`].join(' ');

	const borderLeft = `${bar?.size || '3px'} ${bar?.style || 'solid'} ${bar?.color || colors[type]}`;

	const CurrentIcon = Icons[type];

	const [animStyles, setAnimStyles]: [any, Function] = useState({
		opacity: 0,
		[marginType]: -15,
	});

	const style = {
		paddingLeft: heading ? 25 : undefined,
		minHeight: heading ? 50 : undefined,
		borderLeft,
		...animStyles,
	};

	const handleHide = () => {
		setAnimStyles({ opacity: 0, [marginType]: '-15px' });

		setTimeout(() => {
			onHide(id, position);
		}, 300);
	};

	useEffect(() => {
		const animTimeout = setTimeout(() => {
			setAnimStyles({ opacity: 1, [marginType]: '15px' });
		}, 50);

		let hideTimeout;

		if (hideAfter !== 0) {
			hideTimeout = setTimeout(() => {
				handleHide();
			}, hideAfter * 1000);
		}

		return () => {
			clearTimeout(animTimeout);

			if (hideTimeout) {
				clearTimeout(hideTimeout);
			}
		};
	}, []);

	useEffect(() => {
		if (!show) {
			handleHide();
		}
	}, [show]);

	const clickProps = {
		tabIndex: 0,
		onClick,
		onKeyPress: (e: any) => {
			if (e.keyCode === 13) {
				onClick(e);
			}
		},
	};

	return (
		<div className={className} role={role} style={style} {...(onClick ? clickProps : {})}>
			{renderIcon ? renderIcon() : <CurrentIcon />}
			<div className={heading ? 'ct-text-group-heading' : 'ct-text-group'}>
				{heading && <h4 className="ct-heading">{heading}</h4>}
				<div className="ct-text">{text}</div>
			</div>
		</div>
	);
};

Toast.propTypes = {
	type: string.isRequired,
	text: oneOfType([string, node]).isRequired,
	show: bool,
	onHide: func,
	id: oneOfType([string, number]),
	hideAfter: number,
	heading: string,
	position: string,
	renderIcon: func,
	bar: shape({}),
	onClick: func,
	role: string,
};

export default Toast;
