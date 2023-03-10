import { BoardButton, BoardButtonContainer } from "./BoardButton";
import { useState, useEffect } from 'react'
import { Label, Input, ColorContainer } from "./ColorButton";
import { CheckButton, CheckContainer} from "./CheckButton"
import { Clue, CluesContainer } from './Clue'
import BoardContainer from "./BoardContainer";
import _ from 'lodash'
import { CodePeg } from './SecretCode'
import { PlayAgainButton, PlayAgainContainer } from "./PlayAgain";
import ConfettiComponent from "./Confetti";
import { RulesButton, Rules, RulesContainer } from "./Rules";




function Board() {
    const [boardButtons, setBoardButtons] = useState(createBoardButtons())
    const [colorPicker, setColorPicker] = useState(createColorPicker())
    const [selectedColor, setSelectedColor] = useState(1)
    const [secretCode, setSecretCode] = useState([4,1,4,4])
    const [clues, setClues] = useState(createClues())
    const [playerTurn, setPlayerTurn] = useState(1)
    const [activeButtons, setActiveButtons] = useState([0, 1, 2, 3])
    const [arrayToCheck, setArrayToCheck] = useState([])
    const [exactMatches, setExactMatches] = useState([])
    const [numInCode, setNumInCode] = useState([])
    const [youWin, setYouWin] = useState(false)
    const [youLose, setYouLose] = useState(false)
    const [checkActive, setCheckActive] = useState(false)
    const [newGame, setNewGame] = useState(false)
    const [rulesOn, setRulesOn] = useState(false)

    // Generate objects for board elements
    // ================================================
    function createClues() {
        const newClues = []
        for (let i = 0; i < 10; i++) {
            newClues.push({
                id: i + 1,
                exactMatches: 0,
                numInCode: 0
            })
        }
        return newClues
    }
    
    function createColorPicker() {
        const newColors = []
        for (let i = 0; i < 8; i++) {
            newColors.push({
                id: i,
                colorValue: i + 1
            })
        }
        return newColors
    }

    function createBoardButtons() {
        const newBoardButtons = []
        for (let i = 0; i < 40; i++) {
            newBoardButtons.push({
                id: i,
                colorValue: 0,
                isActive: false
            })
        }
        return newBoardButtons
    }

    // Side effects
    // ==================================================================================
    useEffect(() => {
        setBoardButtons(prevBoardButtons => (
            prevBoardButtons.map(button => {
                return activeButtons.includes(button.id) ?
                {...button, isActive: true} :
                {...button, isActive: false}
            })
        ))
    }, [activeButtons])

    useEffect(() => {
        setClues(prevClues => prevClues.map(clue => {
            return clue.id === playerTurn -1 ? 
            {...clue, exactMatches: exactMatches.length, numInCode: numInCode.length} :
            {...clue}
        }))
    }, [activeButtons])

    useEffect(() => {
        setExactMatches([])
    }, [activeButtons])

    useEffect(() => {
        setNumInCode([])
    }, [activeButtons])

    useEffect(() => {
        const currentButtonObjects = []
        boardButtons.map(button => {
            return activeButtons.includes(button.id) &&
            currentButtonObjects.push(button)
        })
        setArrayToCheck(currentButtonObjects.map(obj => obj.colorValue))
    }, [boardButtons])

    useEffect(() => {
        if (exactMatches.length > 3) {
            setYouWin(true)
        }
    }, [exactMatches])

    useEffect(() => {
        if(activeButtons[0] >= boardButtons.length){
            setYouLose(true)
        }
    }, [activeButtons, boardButtons])

    useEffect(() => {
        setCheckActive(arrayToCheck.every(el => el > 0) ? true : false)
    }, [arrayToCheck])
    

    // HandleClicks
    // =================================================================
    function handleBoardClick(id) {
        setBoardButtons(oldButtons => oldButtons.map(button => {
            return button.id === id ? 
            {...button, colorValue: selectedColor} :
            button
    })) 
    console.log(boardButtons)
    console.log(secretCode)
    }
    

    function handleColorClick(colorValue) {
        setSelectedColor(colorValue)
    }

    function toggleRules() {
        setRulesOn(prevRulesOn => !prevRulesOn)
    }

    function handleCheckClick() {
        checkEquality()
        checkNumInCode()
        updatePlayerTurn()
        changeActiveButtons()
    }

    function checkEquality() {
        for (let i = 0; i < 4; i++) {
            if (arrayToCheck[i] === secretCode[i]) {
                setExactMatches(prevExactMatches => [...prevExactMatches, 1])
            }
        }
    }

    function checkNumInCode() {
        let set = _.uniq(arrayToCheck)
        set.forEach(item => {
            if (secretCode.includes(item)) {
                setNumInCode(prev => [...prev, 1])
            }
        })
    }

    function changeActiveButtons() {
        setActiveButtons(prev => prev.map(button => {
            return button + 4
        }))
    }

    function updatePlayerTurn() {
        setPlayerTurn(prev => prev + 1)
    }

   function playAgain() {
        setBoardButtons(createBoardButtons())
        setSelectedColor(1)
        setClues(createClues())
        setPlayerTurn(1)
        setActiveButtons([0,1,2,3])
        setArrayToCheck([])
        setExactMatches([])
        setNumInCode([])
        setYouWin(false)
        setYouLose(false)
        setNewGame(prevNewGame => !prevNewGame)
   }
    
   
    //Board Elements
    //============================================================
    const boardButtonElements = boardButtons.map(button => (
        <BoardButton key={button.id} id={button.id} colorValue={button.colorValue} disabled={youWin || !button.isActive} onClick={() => handleBoardClick(button.id)}/>
    ))

    const colorPickerElements = colorPicker.map(button => (
        <Label key={button.id} value={button.colorValue}>
            <Input type='radio' name='colorPicker' id={button.id} value={button.colorValue} checked={selectedColor === button.colorValue} onChange={() => handleColorClick(button.colorValue)} />
        </Label>
    ) )

    const clueElements = clues.map(clue => (
        <Clue key={clue.id} id={clue.id} exactMatches={clue.exactMatches} numInCode={clue.numInCode}/>
    ))

    // Fetch
    // ============================================================
    let url = 'https://www.random.org/integers/?num=4&min=1&max=8&col=1&base=10&format=plain&rnd=new'

    useEffect(() => {
        fetch(url, {mode: 'cors'})
            .then(res => res.text())
            .then(data => setSecretCode((data.replace(/\r?\n|\r/g, '').split('')).map(str => parseInt(str))))
    }, [url, newGame])

   
    

    return(
        <BoardContainer>
            {youWin && <ConfettiComponent />}
            <ColorContainer>
                {colorPickerElements}
            </ColorContainer>
            <BoardButtonContainer>
                {boardButtonElements}
            </BoardButtonContainer>
            <CluesContainer>
                {clueElements}
            </CluesContainer>
            <CheckContainer>
                {(youWin || youLose) ? secretCode.map((el, i) => (<CodePeg key={i} colorValue={el} /> )) :
                <CheckButton disabled={!checkActive} onClick={handleCheckClick}>Check</CheckButton>}
            </CheckContainer>
            <RulesContainer>
                {rulesOn && <Rules />}
                <RulesButton onClick={toggleRules}>{rulesOn ? `Hide Rules` : `Show Rules`}</RulesButton>
            </RulesContainer>
            {(youWin || youLose) && <PlayAgainContainer>
                    {youWin && <p>Congratulations!</p>}
                    {youLose && <p>Sorry. Better luck next time!</p>}
                    <PlayAgainButton onClick={playAgain}>Play Again</PlayAgainButton>
                </PlayAgainContainer> } 
        </BoardContainer>
    )
}

export default Board