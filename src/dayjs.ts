/* eslint-disable no-duplicate-imports */
// Duplicate side-effect imports are necessary to import the 'dayjs' module interface overloads and include them in the build.
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/plugin/relativeTime';
import minMax from 'dayjs/plugin/minMax';
import 'dayjs/plugin/minMax';

// Apply plugins:
dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(relativeTime);
dayjs.extend(minMax);

type ExtendedDayjs = ReturnType<typeof dayjs>;

export const Dayjs = dayjs;
export type Dayjs = ExtendedDayjs;
export default Dayjs;
