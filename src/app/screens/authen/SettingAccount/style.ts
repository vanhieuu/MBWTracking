import { AppTheme } from "@theme";
import { StyleSheet, ViewStyle } from "react-native";

export const rootStyles  = (theme:AppTheme) => StyleSheet.create({
    root:{
        flex:1,
        backgroundColor:theme.colors.bg_neutral
    } as ViewStyle
})

export const itemStyle = (theme:AppTheme ) => StyleSheet.create({
    containItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 56,
      } as ViewStyle,
})