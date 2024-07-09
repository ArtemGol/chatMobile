import { ViewStyle } from 'react-native';

export type Mods = Record<string, boolean | undefined>;

export function classNames(
    baseStyle: ViewStyle,
    mods: Mods = {},
    additional: Array<ViewStyle | undefined> = [],
    styles: Record<string, ViewStyle>
): ViewStyle {
    const combinedStyle: ViewStyle = {
        ...baseStyle,
        ...additional.reduce((acc, style) => ({ ...acc, ...style }), {}),
    };

    Object.keys(mods).forEach(key => {
        if (mods[key] && styles[key]) {
            Object.assign(combinedStyle, styles[key]);
        }
    });

    return combinedStyle;
}
