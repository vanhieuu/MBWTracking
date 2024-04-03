import { AppTheme } from "@theme";
import { StyleSheet,ViewStyle,TextStyle } from "react-native";


export const rootStyles = (theme:AppTheme) => StyleSheet.create({

})


export const formStyle = (theme:AppTheme) => StyleSheet.create({
    button:(value:string) => ({
        backgroundColor: value === '' ? theme.colors.bg_disable : theme.colors.primary,
        justifyContent:'center',
        height:48,
        alignItems:'center',
        borderRadius:16,

    }) as ViewStyle
})