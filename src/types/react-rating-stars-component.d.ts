declare module 'react-rating-stars-component' {
	import * as React from 'react';

	interface ReactStarRatingProps {
		count: number;
		value: number;
		activeColor?: string;
		size?: number;
		color?: string;
		editing?: boolean;
		isHalf?: boolean;
		emptyIcon?: React.ReactNode;
		halfIcon?: React.ReactNode;
		filledIcon?: React.ReactNode;
		onChange?: (newValue: number) => void;
	}

	const ReactStarRating: React.FC<ReactStarRatingProps>;

	export default ReactStarRating;
}