import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
    pageContainer: { //universal
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        backgroundColor: '#1F2937',
        // borderWidth: 2,
        // borderColor: 'red',
    },
    scrollContent: { //universal
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingTop: 120,
        padding: 15,
        // borderWidth: 2,
        // borderColor: 'blue',
    },
    scrollContainer: { //universal
        flex: 1,
        width: '100%',
        padding: 0,
        backgroundColor: '#1F2937',
        // borderWidth: 2,
        // borderColor: 'green',
    },
    fullLogo: {  //universal
        width: 200,
        height: 50,
    },
    inputContainer: {  //universal
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems:'center',
        width: '100%',
        height: 50,
        backgroundColor: '#374151',
        borderRadius: 8,
        paddingHorizontal: 16,
        gap: 20,
        borderWidth: 1,
        borderColor: '#9CA3AF',
    },
    textInput: {   //universal
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    primaryButton: {  //universal
        width: '100%',
        height: 50,
        backgroundColor: '#A78BFA',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goBackButton: {  //it has to be inside scrollView
        width: 'auto',
        height: 'auto',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        top: 85,
        left: 15,
        zIndex: 1,
    }, 
    primaryButtonText: {  //universal
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textLink: { //universal
        color: '#A78BFA',
        fontSize: 16,
    },
    placeholderText: { //universal
        color: '#9CA3AF',
        fontSize: 16,
    },
    standardText: { //universal
        fontSize: 18,
        color: '#FFFFFF',
    },
    secondaryText: { //universal    
        fontSize: 16,
        color: '#9CA3AF',
    },
});

export default commonStyles;