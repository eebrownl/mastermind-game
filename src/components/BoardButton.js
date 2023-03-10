import styled from "styled-components"

const handleColorValue = ( colorValue, disabled) => {
   
    switch(colorValue) {
        case 1:
            return "skyBlue";
        case 2:
            return "darkSeaGreen";
        case 3:
            return "pink";
        case 4:
            return "mediumSlateBlue";
        case 5:
            return "gold";
        case 6:
            return "crimson";
        case 7:
            return "darkCyan";
        case 8:
            return "darkOrange";
        default: 
            if (disabled) {
                return "dimGrey"
        } else {
            return "floralWhite"
        }
}
}

const BoardButton = styled.button`
   
    

    height: 40px;
    width: 40px;
    border-radius: 40px;
    background: ${({ colorValue, disabled }) => handleColorValue(colorValue, disabled)};
    border: 1px solid grey;
    justify-self: center;

    

`

const BoardButtonContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(10, 1fr);
    grid-gap: .6em;
    width: 300px;
    margin: 0 auto;
    grid-row: 1 /2;
    grid-column: 2 / 3;
    align-items: center;
    background: papayaWhip;
    padding: .8em;
    border-radius: 8px;
`

export { BoardButton, BoardButtonContainer }