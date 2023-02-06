// My conlang keeps changing names but I will keep it as qualleish now rip nopiosee ):
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom';
import { nanoid } from 'nanoid';
import './index.css';
import { useCookies } from 'react-cookie';
var seedrandom = require('seedrandom');

// Qualleish is a constructed language that you can learn using this app.


var audio;
class MCVocabularyQuestion {
    constructor(phrase, answerOptions, correctAnswer, qualleish = false) {
        this.phrase = phrase;
        this.answerOptions = answerOptions;
        this.correctAnswer = correctAnswer;
        this.qualleish = qualleish;

        this.optionIDsMap = new Map(answerOptions.map(option => [option, `option${nanoid()}`]));
    }

    pronounce() {
        // Bad code:
        playAudio(this.phrase);
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <div id="parent">
                <button onClick={() => this.pronounce()}>Pronounce</button>
                <MCVocabularyQuestionDisplay
                    vocabularyPhrase={this.phrase}
                    answerOptions={this.answerOptions}
                    optionIDsMap={this.optionIDsMap}
                    correctAnswer={this.correctAnswer}
                    handleNextQuestion={handleNextQuestionMethod} />
            </div>
        );
    }
}

class MCSentenceQuestion {
    constructor(sentence, answerOptions, correctAnswer) {
        this.sentence = sentence;
        this.answerOptions = answerOptions;
        this.correctAnswer = correctAnswer;

        this.optionIDsMap = new Map(answerOptions.map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <MCSentenceQuestionDisplay
                sentence={this.sentence}
                answerOptions={this.answerOptions}
                optionIDsMap={this.optionIDsMap}
                correctAnswer={this.correctAnswer}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class AssemblingTranslationQuestion {
    constructor(sentence, wordOptions, translation) {
        this.sentence = sentence;
        this.wordOptions = wordOptions.sort(() => Math.random() - 0.5);
        this.translation = translation;

        this.optionIDsMap = new Map(wordOptions.map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <AssemblingTranslationQuestionDisplay
                sentence={this.sentence}
                wordOptions={this.wordOptions}
                optionIDsMap={this.optionIDsMap}
                translation={this.translation.toLowerCase()}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class AudioHearQuestion {
    constructor(sentence, meaning) {
        this.sentence = sentence;
        this.meaning = meaning;
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <div>
                <AudioHearQuestionDisplay
                    sentence={this.meaning}
                    answer={this.sentence}
                    handleNextQuestion={handleNextQuestionMethod} />
            </div>
        );
    }
}

class WritingTranslationQuestion {
    constructor(sentence, translation) {
        this.sentence = sentence;
        this.translation = translation;
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <WritingTranslationQuestionDisplay
                sentence={this.sentence}
                answer={this.translation}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class PairsQuestion {
    constructor(firstLanguageWords, targetLanguageWords, matches) {
        this.firstLanguageWords = firstLanguageWords.sort(() => Math.random() - 0.5);
        this.targetLanguageWords = targetLanguageWords.sort(() => Math.random() - 0.5);
        this.matches = matches;

        this.optionIDsMap = new Map((firstLanguageWords.concat(targetLanguageWords)).map(option => [option, `option${nanoid()}`]));
    }

    displayQuestion(handleNextQuestionMethod) {
        return (
            <PairsQuestionDisplay
                firstLanguageWords={this.firstLanguageWords}
                targetLanguageWords={this.targetLanguageWords}
                matches={this.matches}
                optionIDsMap={this.optionIDsMap}
                handleNextQuestion={handleNextQuestionMethod} />
        );
    }
}

class LessonInformation {
    constructor(lessonName, questionsArray) {
        this.lessonName = lessonName;
        this.questionsArray = questionsArray;
    }
}

class LessonTopBar extends React.Component {
    render() {
        const questionNumber = this.props.questionNumber;

        return (
            <div>
                <div>
                    Quit Lesson
                </div>
                <div>
                    Question {questionNumber}
                </div>
            </div>
        );
    }
}

class AudioAnswerFeedback extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this); // When submit clicked
    }

    handleClick() {
        this.props.handleNextQuestion();
    }

    render() {
        const userAnswer = this.props.userAnswer;
        const correctAnswer = this.props.correctAnswer;
        const answerWasSubmitted = this.props.answerWasSubmitted;

        let feedbackArea;
        if (!answerWasSubmitted) {
            feedbackArea =
                <div> <input type="submit" value="Submit Answer" /> </div>;
        } else {
            if (userAnswer !== correctAnswer) {
                const audioElem = new Audio('audio_wrong.mp3');
                audioElem.play();
            }
            else {
                const audioElem = new Audio('audio_correct.mp3');
                audioElem.play();
            }
            feedbackArea = (
                <div>
                    <div> {(userAnswer === correctAnswer) ? 'Correct\nMeaning: ' + this.props.meaningAnswer : 'Incorrect, it was ' + correctAnswer} </div>
                    <div> <button onClick={this.handleClick}>Continue</button> </div>
                </div>
            );
        }

        return (
            <section>{feedbackArea}</section>
        );
    }
}

class AnswerFeedback extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this); // When submit clicked
    }

    handleClick() {
        this.props.handleNextQuestion();
    }

    render() {
        const userAnswer = this.props.userAnswer;
        const correctAnswer = this.props.correctAnswer;
        const answerWasSubmitted = this.props.answerWasSubmitted;

        let feedbackArea;
        if (!answerWasSubmitted) {
            feedbackArea =
                <div> <input type="submit" value="Submit Answer" /> </div>;
        } else {
            if (userAnswer !== correctAnswer) {
                const audioElem = new Audio('audio_wrong.mp3');
                audioElem.play();
            }
            else {
                const audioElem = new Audio('audio_correct.mp3');
                audioElem.play();
            }
            feedbackArea = (
                <div>
                    <div> {(userAnswer === correctAnswer) ? 'Correct' : 'Incorrect, it was ' + correctAnswer} </div>
                    <div> <button onClick={this.handleClick}>Continue</button> </div>
                </div>
            );
        }

        return (
            <section>{feedbackArea}</section>
        );
    }
}

class MCQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(event) {
        this.props.handleInputChange(parseInt(event.target.value, 10));
    }

    handleSubmit(event) {
        this.props.handleSubmit();
        event.preventDefault();
    }

    handleNextQuestion() {
        this.props.handleNextQuestion();
    }

    render() {
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.props.answerSelection;
        const answerWasSubmitted = this.props.answerWasSubmitted;
        const instructions = this.props.instructions;
        const optionItems = options.map((optionText, number) =>
            <li key={optionIDsMap.get(optionText)}>
                <label>
                    {optionText}
                    <input
                        type="radio"
                        name="answerOption"
                        value={(number + 1)}
                        checked={((number + 1) === selection)}
                        onChange={this.handleInputChange} />
                </label>
            </li>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                <section>
                    {instructions}
                    <fieldset>
                        <legend>Select</legend>
                        <ul>
                            {optionItems}
                        </ul>
                    </fieldset>
                </section>
                <AnswerFeedback
                    userAnswer={selection}
                    answerWasSubmitted={answerWasSubmitted}
                    correctAnswer={correctAnswer}
                    handleNextQuestion={this.handleNextQuestion} />
            </form>
        );
    }
}

class MCVocabularyQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { answerSelection: 0, answerWasSubmitted: false };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(selection) {
        this.setState({ answerSelection: selection });
    }

    handleSubmit() {
        this.setState({ answerWasSubmitted: true });
    }

    handleNextQuestion() {
        this.setState({ answerSelection: 0, answerWasSubmitted: false });
        this.props.handleNextQuestion();
    }

    render() {
        const vocabularyPhrase = this.props.vocabularyPhrase;
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.state.answerSelection;
        const answerWasSubmitted = this.state.answerWasSubmitted;
        const instructions = <p>{`${vocabularyPhrase}`}</p>;

        return (
            <MCQuestionDisplay
                answerOptions={options}
                optionIDsMap={optionIDsMap}
                correctAnswer={correctAnswer}
                answerSelection={selection}
                answerWasSubmitted={answerWasSubmitted}
                instructions={instructions}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                handleNextQuestion={this.handleNextQuestion} />
        );
    }
}

class MCSentenceQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { answerSelection: 0, answerWasSubmitted: false };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleInputChange(selection) {
        this.setState({ answerSelection: selection });
    }

    handleSubmit() {
        this.setState({ answerWasSubmitted: true });
    }

    handleNextQuestion() {
        this.props.handleNextQuestion();
    }

    render() {
        const sentence = this.props.sentence;
        const options = this.props.answerOptions;
        const optionIDsMap = this.props.optionIDsMap;
        const correctAnswer = this.props.correctAnswer;
        const selection = this.state.answerSelection;
        const answerWasSubmitted = this.state.answerWasSubmitted;
        const instructions = <div><h1>Select the correct translation</h1><p>{sentence}</p></div>;

        return (
            <MCQuestionDisplay
                answerOptions={options}
                optionIDsMap={optionIDsMap}
                correctAnswer={correctAnswer}
                answerSelection={selection}
                answerWasSubmitted={answerWasSubmitted}
                instructions={instructions}
                handleInputChange={this.handleInputChange}
                handleSubmit={this.handleSubmit}
                handleNextQuestion={this.handleNextQuestion} />
        );
    }
}

class AssemblingTranslationQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userAnswer: [], answerWasSubmitted: false };

        this.handleAddWord = this.handleAddWord.bind(this);
        this.handleRemoveWord = this.handleRemoveWord.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clicked = [];
        this.done = 0;
        ;
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({ userAnswer: '', answerWasSubmitted: false });
        this.props.handleNextQuestion();
    }

    handleAddWord(event) {
        const updatedAnswer = this.state.userAnswer.concat(event.target.value.toLowerCase());
        this.clicked.push(event.target.id);
        this.setState({ userAnswer: updatedAnswer });
    }

    handleRemoveWord(event) {
        const updatedAnswer = this.state.userAnswer.filter((word) => word !== event.target.value);
        this.clicked = this.clicked.filter(function (f) { return f !== event.target.id });
        this.setState({ userAnswer: updatedAnswer });
    }

    handleSubmit(event) {
        this.setState({ answerWasSubmitted: true });
        event.preventDefault();
    }

    render() {
        const sentence = this.props.sentence;
        const translation = this.props.translation.toLowerCase();
        const wordOptions = this.props.wordOptions;
        const optionIDsMap = this.props.optionIDsMap;

        const userAnswer = this.state.userAnswer;
        const userAnswerSentence = `${userAnswer.join(' ')}.`;
        const userAnswerWordButtons = this.clicked.map((word, index) =>
            <button
                onClick={this.handleRemoveWord}
                key={`user${optionIDsMap.get(word)}`}
                id={word.toString()}
                type="button"
                value={wordOptions[word]}>
                {wordOptions[word]}
            </button>
        );
        const wordOptionButtons = wordOptions.map((word, index) =>
            <button
                onClick={this.handleAddWord}
                key={optionIDsMap.get(word)}
                value={word}
                type="button"
                id={index}
                disabled={this.clicked.includes(index.toString())}>
                {word}
            </button>
        );
        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Translate this sentence</h1>
                <p>{sentence}</p>
                <div>
                    {userAnswerWordButtons}
                </div>
                <div>
                    {wordOptionButtons}
                </div>
                <AnswerFeedback
                    userAnswer={userAnswerSentence}
                    answerWasSubmitted={this.state.answerWasSubmitted}
                    correctAnswer={translation}
                    handleNextQuestion={this.handleNextQuestion} />
            </form>
        );
    }
}

class WritingTranslationQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userAnswer: '', answerWasSubmitted: false };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({ userAnswer: '', answerWasSubmitted: false });
        this.props.handleNextQuestion();
    }

    handleChange(event) {
        this.setState({ userAnswer: event.target.value });
    }

    handleSubmit(event) {
        this.setState({ answerWasSubmitted: true });
        event.preventDefault();
    }

    render() {
        const sentence = this.props.sentence;
        const answer = this.props.answer;
        return (
            <div id="parent">
                <form onSubmit={this.handleSubmit}>
                    <h1>Translate this sentence</h1>
                    <p>{sentence}</p>
                    <div>
                        <label>
                            Write answer:
                            <textarea value={this.state.answerText} onChange={this.handleChange} id="answ" rows="10" cols="50" />
                        </label>
                        <br />
                    </div>
                    <AnswerFeedback
                        userAnswer={this.state.userAnswer.toLowerCase()}
                        answerWasSubmitted={this.state.answerWasSubmitted}
                        correctAnswer={answer.toLowerCase()}
                        handleNextQuestion={this.handleNextQuestion} />
                </form>
                <EasyButtons />
            </div>
        );
    }
}

function playAudio(word) {
    return new Promise((resolve) => {
        if (word === "con") {   // Windows does not like "con" as filename
            word = "__con";
        }
        if (word.includes("ke-")) {
            word = word.replace("ke-", "");
            let audio = new Audio('ke-.mp3');
            audio.play();
            audio.addEventListener("ended", () => {
                let audio = new Audio(word.toLowerCase().replace("?", "").replace(",", "").replace("!", "").replace(".", "") + '.mp3');
                audio.play();
                audio.addEventListener("ended", () => {
                    resolve();
                });
            });
        }
        else {

            let audio = new Audio(word.toLowerCase().replace("?", "").replace(",", "").replace("!", "").replace(".", "") + '.mp3');
            audio.play();
            audio.addEventListener("ended", () => {
                resolve();
            });
        }
    })
}

class AudioHearQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { userAnswer: '', answerWasSubmitted: false };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({ userAnswer: '', answerWasSubmitted: false });
        this.props.handleNextQuestion();
    }

    handleChange(event) {
        this.setState({ userAnswer: event.target.value });
    }

    handleSubmit(event) {
        this.setState({ answerWasSubmitted: true });
        event.preventDefault();
    }
    togglePlay = () => {
        var splitted = this.props.answer.split(" ");
        (async () => {
            for (var word of splitted) {
                await playAudio(word);
            }
        })();
    }
    render() {
        const answer = this.props.answer;
        const sentence = this.props.sentence;
        return (
            <div id="parent">
                <form onSubmit={this.handleSubmit}>
                    <button type="button" onClick={this.togglePlay}>Play</button>
                    <h1>What do you hear?</h1>
                    <div>
                        <label>
                            Write answer:
                            <textarea value={this.state.answerText} onChange={this.handleChange} id="answ" rows="10" cols="50" />
                        </label>
                        <br />
                    </div>
                    <AudioAnswerFeedback
                        userAnswer={this.state.userAnswer.toLowerCase()}
                        answerWasSubmitted={this.state.answerWasSubmitted}
                        correctAnswer={answer.toLowerCase()}
                        meaningAnswer={sentence.toLowerCase()}
                        handleNextQuestion={this.handleNextQuestion} />
                </form>
                <EasyButtons />
            </div>
        );
    }
}

class EasyButtons extends React.Component {
    render() {
        return (<div>
            <button onClick={() => document.getElementById('answ').value += 'ỹ'}>ỹ</button>
            <button onClick={() => document.getElementById('answ').value += 'á'}>á</button>
            <button onClick={() => document.getElementById('answ').value += 'à'}>à</button>
            <button onClick={() => document.getElementById('answ').value += 'ú'}>ú</button>
            <button onClick={() => document.getElementById('answ').value += 'ù'}>ù</button>
            <button onClick={() => document.getElementById('answ').value += 'ơ'}>ơ</button>
            <button onClick={() => document.getElementById('answ').value += 'ô'}>ô</button>
            <button onClick={() => document.getElementById('answ').value += 'õ'}>õ</button>
            <button onClick={() => document.getElementById('answ').value += 'ó'}>ó</button>
            <button onClick={() => document.getElementById('answ').value += 'ò'}>ò</button>
            <button onClick={() => document.getElementById('answ').value += 'í'}>í</button>
            <button onClick={() => document.getElementById('answ').value += 'ì'}>ì</button>
            <button onClick={() => document.getElementById('answ').value += 'ê'}>ê</button>
            <button onClick={() => document.getElementById('answ').value += 'é'}>é</button>
            <button onClick={() => document.getElementById('answ').value += 'è'}>è</button>
            <button onClick={() => document.getElementById('answ').value += 'ñ'}>ñ</button>
        </div>);
    }
}

class PairsWordCell extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, language) {
        this.props.onClick(event.target.value, language);
    }

    render() {
        const word = this.props.word;
        const selected = this.props.selected;
        const alreadyMatched = this.props.alreadyMatched;
        const matchCorrect = this.props.matchCorrect;
        const matchIncorrect = this.props.matchIncorrect;
        const language = this.props.language;
        let classesArray = [];
        const possibleClasses = ['pairWordSelected', 'pairAlreadyMatched', 'pairMatchCorrect', 'pairMatchIncorrect'];
        [(selected && !(matchCorrect || matchIncorrect)), alreadyMatched, (selected && matchCorrect && !alreadyMatched), (selected && matchIncorrect && !alreadyMatched)].forEach((property, propertyIndex) => {
            if (property) { classesArray.push(possibleClasses[propertyIndex]) }
        }
        );
        const buttonClassNames = classesArray.join(' ');

        return (
            <th>
                <button
                    onClick={(event) => this.handleClick(event, language)}
                    value={word}
                    disabled={alreadyMatched || matchCorrect || matchIncorrect}
                    className={buttonClassNames}>
                    {word}
                </button>
            </th>
        )
    }
}

class PairsQuestionDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { firstLanguageWordsMatched: [], firstLanguageSelection: '', targetLanguageSelection: '' };
        this.handleNextQuestion = this.handleNextQuestion.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleWordSelection = this.handleWordSelection.bind(this);
    }

    componentDidUpdate() {
        if (document.getElementById('autocontinue')) {
            document.getElementById('autocontinue').click();
        }
    };

    handleNextQuestion() {
        this.setState({ firstLanguageWordsMatched: [], firstLanguageSelection: '', targetLanguageSelection: '' });
        this.props.handleNextQuestion();
    }

    handleContinue(event) {
        if (event.target.name === 'correctContinue') {
            let firstLWMArray = this.state.firstLanguageWordsMatched;
            firstLWMArray.push(this.state.firstLanguageSelection);
            this.setState({ firstLanguageWordsMatched: firstLWMArray, firstLanguageSelection: '', targetLanguageSelection: '' });
        } else {
            this.setState({ firstLanguageSelection: '', targetLanguageSelection: '' });
        }
    }

    handleWordSelection(word, language) {
        const selectionInFirstLanguage = (language === 'firstLanguage');
        const languageKey = (selectionInFirstLanguage ? 'firstLanguageSelection' : 'targetLanguageSelection');
        const otherLanguageWord = (selectionInFirstLanguage ? this.state.targetLanguageSelection : this.state.firstLanguageSelection);
        if (otherLanguageWord === '') {
            if (word === this.state[languageKey]) {
                this.setState({ [languageKey]: '' });
            } else {
                this.setState({ [languageKey]: word });
            }
        } else {
            this.setState({ [languageKey]: word });
        }
    }

    render() {
        const firstLanguageWords = this.props.firstLanguageWords;
        const targetLanguageWords = this.props.targetLanguageWords;
        const matches = this.props.matches;
        const optionIDsMap = this.props.optionIDsMap;
        const firstLWordsMatched = this.state.firstLanguageWordsMatched;
        const firstLanguageSelection = this.state.firstLanguageSelection;
        const targetLanguageSelection = this.state.targetLanguageSelection;
        const targetLWordsMatched = firstLWordsMatched.map(firstLWord => matches.get(firstLWord));
        const matchAttempted = !((firstLanguageSelection === '') || (targetLanguageSelection === ''));
        const matchCorrect = (matchAttempted && (targetLanguageSelection === this.props.matches.get(firstLanguageSelection)));
        const matchIncorrect = (matchAttempted && (targetLanguageSelection !== this.props.matches.get(firstLanguageSelection)));
        const allMatched = matchCorrect && (firstLWordsMatched.length >= (matches.size - 1));

        const wordButtonsTable = firstLanguageWords.map((firstLanguageWord, wordIndex) =>
            <tr key={optionIDsMap.get(firstLanguageWord)}>
                <PairsWordCell
                    word={firstLanguageWord}
                    selected={firstLanguageWord === firstLanguageSelection}
                    alreadyMatched={firstLWordsMatched.includes(firstLanguageWord)}
                    matchCorrect={matchCorrect}
                    matchIncorrect={matchIncorrect}
                    language='firstLanguage'
                    onClick={this.handleWordSelection} />
                <PairsWordCell
                    word={targetLanguageWords[wordIndex]}
                    selected={targetLanguageWords[wordIndex] === targetLanguageSelection}
                    alreadyMatched={targetLWordsMatched.includes(targetLanguageWords[wordIndex])}
                    matchCorrect={matchCorrect}
                    matchIncorrect={matchIncorrect}
                    language='targetLanguage'
                    onClick={this.handleWordSelection} />
            </tr>
        );

        let answerFeedbackArea = '';
        if (matchCorrect && !allMatched) {
            answerFeedbackArea = (<div>
                <p>Match correct!</p>
                <button name='correctContinue' id='autocontinue' onClick={this.handleContinue}>Click to continue</button>
            </div>);
        }
        if (matchIncorrect) {
            answerFeedbackArea = (<div>
                <p>Match incorrect</p>
                <button name='incorrectContinue' onClick={this.handleContinue}>Click to continue</button>
            </div>);
        }
        if (allMatched) {
            answerFeedbackArea = (<div>
                <p>Excellent!</p>
                <button onClick={this.handleNextQuestion}>Click to continue</button>
            </div>);
        }



        return (
            <div>
                <h1>Match the pairs</h1>
                <table>
                    <tbody>
                        {wordButtonsTable}
                    </tbody>
                </table>
                {answerFeedbackArea}
            </div>
        );
    }
}

class LessonDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { questionNumber: 1 };

        this.handleNextQuestion = this.handleNextQuestion.bind(this);
    }

    handleNextQuestion() {
        this.setState({
            questionNumber: (this.state.questionNumber + 1)
        });
    }

    render() {
        if ((this.state.questionNumber - 1) === CURRENT_LESSON.questionsArray.length) {
            var oldValue = getCookie("level");
            setCookie("level", ++oldValue, 31);
            return (<AppDisplay />);
        }
        const currentQuestion = CURRENT_LESSON.questionsArray[(this.state.questionNumber - 1)];
        const currentQuestionDisplay = currentQuestion.displayQuestion(this.handleNextQuestion);
        return (
            <div>
                <div>
                    <LessonTopBar
                        questionNumber={this.state.questionNumber} />
                </div>
                <div>
                    {currentQuestionDisplay}
                </div>
                {
                    eval("if (document.getElementById('autocontinue'))document.getElementById('autocontinue').click();")}
            </div>
        );
    }
}

class MenusTopBar extends React.Component {
    render() {
        return (
            <div>
                <p>Learn Qualleish</p>
                <br /><p>Copyright (c) 2023 Novixx Systems</p>
            </div>
        );
    }
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

class LessonSelectionDisplay extends React.Component {
    constructor(props) {
        super(props);
        if (getCookie("level") == "") {
            setCookie("level", 0, 31);
        }
        this.handleClickLesson = this.handleClickLesson.bind(this);
    }

    handleClickLesson(event) {
        if (getCookie('level') >= event.target.id) { 
            this.props.onNavigationSelect('lesson', event.target.name);
        }
    }

    render() {
        return (
            <div>
                <div>Select Lesson</div>
                {lessons.map((element, i) =>
                    <div><button disabled={(getCookie('level') < i)} onClick={this.handleClickLesson} id={i} name={element.lessonName.replaceAll(" ", "_").toUpperCase()}>{element.lessonName}</button></div>
                )}
            </div>
        );
    }
}

class MenusBottomBar extends React.Component {
    render() {
        return (
            <p></p>
        );
    }
}

class MenuDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(navigationCategory, navigationSelection) {
        this.props.onNavigationSelect(navigationCategory, navigationSelection);
    }

    render() {
        return (
            <div>
                <MenusTopBar />
                <LessonSelectionDisplay onNavigationSelect={this.handleNavigationSelect} />
                <MenusBottomBar />
            </div>
        );
    }
}

class AppDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentDisplay: 'lesson-select-menu', lessonID: 'menu' };
        document.title = "Learn Qualleish";
        this.handleNavigationSelect = this.handleNavigationSelect.bind(this);
    }

    handleNavigationSelect(navigationCategory, navigationSelection) {
        switch (navigationCategory) {
            case 'lesson':
                CURRENT_LESSON = eval(navigationSelection);
                this.setState({
                    currentDisplay: 'lesson-display',
                    lessonID: navigationSelection
                });
                break;
            case 'menu':
                this.setState({
                    currentDisplay: navigationSelection,
                    lessonID: 'menu'
                });
                break;
            default:
                this.setState({
                    currentDisplay: 'lesson-select-menu',
                    lessonID: 'menu'
                });
        }
    }

    render() {
        const currentDisplay = this.state.currentDisplay;
        let display;
        switch (currentDisplay) {
            case 'lesson-select-menu':
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
                break;
            case 'lesson-display':
                display = <LessonDisplay
                    lessonID={this.state.lessonID} />;
                break;
            default:
                display = <MenuDisplay onNavigationSelect={this.handleNavigationSelect} />;
        }
        return (
            <div>{display}</div>
        );
    }
}

// Qualleish Lessons
// Basics
const l1q1 = new MCVocabularyQuestion("Chong", ["Bridge", "English", "Qualle", "House"], 4);
const l1q2 = new MCVocabularyQuestion("Chong ketoy", ["My house", "Your house", "Our house", "Their house"], 1);
const l1q3 = new MCVocabularyQuestion("Chong kegoy", ["My house", "Your house", "Our house", "Their house"], 2);
const l1q4 = new MCVocabularyQuestion("Chong kenoy", ["My house", "Your house", "Our house", "Their house"], 3);
const l1q5 = new MCVocabularyQuestion("Chong kethey", ["My house", "Your house", "Our house", "Their house"], 4);
const l1q6 = new MCVocabularyQuestion("Yio kegoy", ["Their dog", "Your dog", "My dog", "Our dog"], 2);
// End Basics
// Basics 2
const l2q1 = new MCVocabularyQuestion("Chong", ["Bridge", "English", "Qualle", "House"], 4);
const l2q2 = new MCVocabularyQuestion("Yia ketoy", ["My cat", "Your cat", "Our cat", "Their cat"], 1);
const l2q3 = new MCVocabularyQuestion("Yia kegoy", ["My cat", "Your cat", "Our cat", "Their cat"], 2);
const l2q4 = new MCVocabularyQuestion("Her cat", ["Yia kephu", "Yia kemas", "Yia ketoy", "Yia kethey"], 1);
const l2q5 = new MCVocabularyQuestion("His cat", ["Yia kephu", "Yia kemas", "Yia ketoy", "Yia kethey"], 2);
const l2q6 = new MCVocabularyQuestion("Their cat", ["Yia kephu", "Yia kemas", "Yia ketoy", "Yia kethey"], 4);
// End Basics 2
// Introduce Yourself
const l3q1 = new MCVocabularyQuestion("My name is", ["Nym ketoy es", "Nym kegoy es", "Nym es", "Es toy"], 1);
const l3q2 = new MCVocabularyQuestion("Your name is", ["Nym ketoy es", "Nym kegoy es", "Nym es", "Es toy"], 2);
const l3q3 = new MCVocabularyQuestion("Hello", ["Xang", "Chang", "Kang to", "Khay goy"], 1);
const l3q4 = new MCVocabularyQuestion("Goodbye", ["Xang", "Chang", "Kang to", "Khay goy"], 4);
const l3q5 = new MCVocabularyQuestion("How?", ["En ti yang?", "Gang?", "Hoe?", "La gi?"], 1);
const l3q6 = new MCVocabularyQuestion("How are you?", ["En ti yang khi goy?", "En ti yang goy?", "En ti khi goy?", "La gi?"], 1);
// End Introduce Yourself
// Numbers
const l4q1 = new MCVocabularyQuestion("One", ["Hung", "Rey", "Nuoy", "Anh"], 2);
const l4q2 = new MCVocabularyQuestion("Two", ["Hung", "Rey", "Nuoy", "Anh"], 3);
const l4q3 = new MCVocabularyQuestion("Three", ["Hung", "Rey", "Nuoy", "Anh"], 1);
const l4q4 = new WritingTranslationQuestion("One house", "Rey chong");
const l4q5 = new MCVocabularyQuestion("Zero", ["Hung", "Rey", "Nuoy", "Anh"], 4);
const l4q6 = new MCVocabularyQuestion("Ten", ["Muoang", "Mang", "Muoing", "Monge"], 1);
// End Numbers
// Use plurals
const l5q1 = new MCVocabularyQuestion("Two houses", ["Nuoy gung chong", "Nuoy chong", "Nuoy gung chonges", "Nuoy chonges"], 1);
const l5q2 = new MCVocabularyQuestion("Cats", ["Yias", "Gung yias", "Gung yia", "Yia"], 3);
const l5q3 = new MCVocabularyQuestion("Dogs", ["Yio", "Gung yio", "Gung yios", "Yio"], 2);
const l5q4 = new MCVocabularyQuestion("My two houses", ["Nuoy gung chong ketoy", "Nuoy chong ketoy", "Nuoy gung chonges ketoy", "Nuoy chonges ketoy"], 1);
const l5q5 = new MCVocabularyQuestion("Your two houses", ["Nuoy gung chong kegoy", "Nuoy chong kegoy", "Nuoy gung chonges kegoy", "Nuoy chonges kegoy"], 1);
const l5q6 = new MCVocabularyQuestion("Our two houses", ["Nuoy gung chong kenoy", "Nuoy chong kenoy", "Nuoy gung chonges kenoy", "Nuoy chonges kenoy"], 1);
// End Use plurals
// Use past tense
const l6q1 = new MCVocabularyQuestion("I was", ["Toy ruo", "Goy ruo", "Noy ruo", "Ruo"], 1);
const l6q2 = new MCVocabularyQuestion("Walk", ["Thoch", "Chong", "Ong", "Ruo"], 1);
const l6q3 = new MCVocabularyQuestion("I walked", ["Toy ruoua thoch", "Toy ruoua chong", "Toy ruoua ong", "Toy ruoua ruo"], 1);
const l6q4 = new MCVocabularyQuestion("I walked to my house", ["Toy ruoua thoch ketoy chong", "Toy ruoua thoch y chong ketoy", "Toy ruoua thoch ketoy chonges", "Toy ruoua thoch chong ketoy"], 2);
const l6q5 = new MCVocabularyQuestion("I had a dog", ["Toy ruoua qui un yio", "Toy ruoua un yio", "Toy ruoua un yioes ketoy", "Toy ruoua qui un yio ketoy"], 1);
const l6q6 = new MCVocabularyQuestion("I had two dogs", ["Toy ruoua qui nuoy gung yio", "Toy ruoua qui nuoy yio", "Toy ruoua qui nuoy gung yioes ketoy", "Toy ruoua qui nuoy yioes ketoy"], 1);
// End Use past tense
// Hear the word
const l7q1 = new AudioHearQuestion("Yio", "dog");
const l7q2 = new AudioHearQuestion("Chong", "house");
const l7q3 = new AudioHearQuestion("Kethey", "their");
const l7q4 = new AudioHearQuestion("Ketoy", "my");
const l7q5 = new AudioHearQuestion("Kegoy", "your");
const l7q6 = new AudioHearQuestion("Kephu", "her");
// End Hear the word
// Simple sentences
const l8q1 = new MCVocabularyQuestion("My house", ["Chong ketoy", "Chong kegoy", "Chong kenoy", "Chong kethey"], 1);
const l8q2 = new WritingTranslationQuestion("My house", "Chong ketoy");
const l8q3 = new MCVocabularyQuestion("Your house", ["Chong ketoy", "Chong kegoy", "Chong kenoy", "Chong kethey"], 2);
const l8q4 = new AssemblingTranslationQuestion("My house is your house", ["Chong", "ketoy", "es", "chong", "kegoy", "y", "Ketoy"], "Chong ketoy es chong kegoy.");
const l8q5 = new WritingTranslationQuestion("My house is your house", "Chong ketoy es chong kegoy");
const l8q6 = new AudioHearQuestion("Chong ketoy", "My house");
// End Simple sentences
// Simple sentences 2
const l9q1 = new MCVocabularyQuestion("My dog is a cat", ["Yio ketoy es yia", "Yio ketoy es yias", "Yio ketoy es un yia", "Yio ketoy es un yias"], 3);
const l9q2 = new AssemblingTranslationQuestion("My dog is a cat", ["Yio", "ketoy", "es", "yia", "Kegoy", "un"], "Yio ketoy es un yia.");
const l9q3 = new MCVocabularyQuestion("Not", ["Kyong", "Khong", "Nam", "Va"], 1);
const l9q4 = new MCVocabularyQuestion("Do not", ["Ngo kyong", "Ong", "Pong", "Trong kyong"], 2);
const l9q5 = new MCVocabularyQuestion("Do not have", ["Ngo kyong qui", "Ong qui", "Pong qui", "Trong kyong qui"], 2);
const l9q6 = new AudioHearQuestion("Yio kephu", "Her dog");
// End Simple sentences 2
// Use real world names
const l10q1 = new MCVocabularyQuestion("My name is", ["Nym ketoy es", "Nym ketoy", "Nym ketoy y", "Nym ketoy es y"], 1);
const l10q2 = new WritingTranslationQuestion("My name is Chaye", "Nym ketoy es Chaye");
const l10q3 = new MCVocabularyQuestion("Toy mon goy", ["I want you", "I want your name", "I want", "I want your"], 1);
const l10q4 = new MCVocabularyQuestion("Mon", ["Want", "Wanting", "Wanted", "Wants"], 1);
const l10q5 = new MCVocabularyQuestion("One", ["Rey", "Hung", "Trong", "Ong"], 1);
const l10q6 = new MCVocabularyQuestion("Two", ["Nuoy", "Gung", "Chong", "Ong"], 1);
// End Use real world names
// Greetings
const l11q1 = new MCVocabularyQuestion("Hello", ["Xang", "Ung", "Ong", "Chang"], 1);
const l11q2 = new MCVocabularyQuestion("Goodbye", ["Xang", "Khay goy", "Ung", "Chong"], 2);
const l11q3 = new MCVocabularyQuestion("No", ["Ca", "Gong", "Kyong", "Va"], 2);
const l11q4 = new MCVocabularyQuestion("Yes", ["Ca", "Gong", "Kyong", "Va"], 1);
const l11q5 = new MCVocabularyQuestion("Yes and no", ["Ca khi gong", "Ca khi kyong", "Ca va", "Gong kyong"], 1);
const l11q6 = new MCVocabularyQuestion("Hello no", ["Xang kyong", "Xang gong", "Xang khi ca", "Xang khi va"], 2);
// End Greetings
// Countries
const l12q1 = new MCVocabularyQuestion("Country", ["Lanta", "Lant", "Lanty", "Lantyia"], 1);
const l12q2 = new MCVocabularyQuestion("Do not", ["Ong", "Vang", "Nheng", "Kyong tong"], 1);
const l12q3 = new MCVocabularyQuestion("Continent", ["Lanta", "Lant", "Lanty", "Lantyia"], 1);
const l12q4 = new MCVocabularyQuestion("The Netherlands", ["Lanta nheng", "Lanta lan", "Lanta lan y", "Lanta yia"], 2);
const l12q5 = new MCVocabularyQuestion("United States", ["Lanta gong", "Lanta dang", "Lanta minh", "Lanta ang"], 3);
const l12q6 = new MCVocabularyQuestion("Vietnam", ["Lanta nheng", "Lanta lan", "Lanta lan y", "Lanta viet"], 4);
// End Countries
// Countries and Languages
const l13q1 = new MCVocabularyQuestion("I live in Vietnam", ["Toy eng lanta viet", "Toy chonoch eng lanta viet", "Toy eng viet", "Toy live in lanta viet"], 2);
const l13q2 = new WritingTranslationQuestion("I do not live in Vietnam", "Toy ong chonoch eng lanta viet");
const l13q3 = new MCVocabularyQuestion("Africa", ["Lanta nheng", "Lanta lan", "Lanta minh", "Lanta ang"], 1);
const l13q4 = new MCVocabularyQuestion("Qualleish", ["Vi lag qualle", "Vi lag qualleish", "Vi lag qualleish y", "Vi lag qualleish yia"], 1);
const l13q5 = new MCVocabularyQuestion("English", ["Vi lag ang", "Vi lag ang y", "Vi lag eng yia", "Vi lag ang yia"], 1);
const l13q6 = new MCVocabularyQuestion("Vietnamese", ["Vi lag viet", "Vi lag viet y", "Vi lag viet yia", "Vi lag viet yia"], 1);
// End Countries and Languages
// Work
const l14q1 = new MCVocabularyQuestion("Work", ["Cher", "Cher y", "Lag cher", "Lag chery"], 1);
const l14q2 = new MCVocabularyQuestion("Working", ["Cher", "Cher y", "Lag cher", "Lag chery"], 1);
const l14q3 = new MCVocabularyQuestion("Worked", ["Ruoua cher", "Ruoua cher y", "Ruoua lag cher", "Lag chery"], 1);
const l14q4 = new MCVocabularyQuestion("Toy cher", ["I work", "I worked", "I working", "I do work"], 1);
const l14q5 = new MCVocabularyQuestion("Toy ong cher", ["I do not work", "I do not worked", "I do not do work", "I don't worked"], 1);
const l14q6 = new MCVocabularyQuestion("Toy mon y cher", ["I want to work", "I wanted to work", "I want to working", "I wanted to worked"], 1);
// End Work
// Animals
const l15q1 = new MCVocabularyQuestion("Dog", ["Yio", "Yio y", "Yio yia", "Yia"], 1);
const l15q2 = new MCVocabularyQuestion("Cat", ["Yia", "Yia y", "Yia yia", "Yia yia y"], 1);
const l15q3 = new MCVocabularyQuestion("Alligator", ["Yia", "Zung chungu", "Zung chungu y", "Zung chungu yia"], 2);
const l15q4 = new MCVocabularyQuestion("The alligator", ["Di zung chungu", "Di zung chungu y", "Di zung chungu yia", "Di zung chungu yia y"], 1);
const l15q5 = new MCVocabularyQuestion("The dog", ["Di yio", "Di yio y", "Di yio yia", "Di yio yia y"], 1);
const l15q6 = new MCVocabularyQuestion("The cat", ["Di yia", "Di yia y", "Di yia yia", "Di yia yia y"], 1);
// End Animals
// Talk about yourself
const l16q1 = new MCVocabularyQuestion("I am", ["Toy khong", "Toy khong y", "Toy khong es", "Toy khong eng"], 1);
const l16q2 = new MCVocabularyQuestion("I want to have a dog", ["Toy mon y qui un yio", "Toy mon y qui un yio y", "Toy mon y qui un yio yia", "Toy mon y qui yio"], 1);
const l16q3 = new MCVocabularyQuestion("I want to have a cat", ["Toy mon y qui un yia", "Toy mon y qui un yia y", "Toy mon y qui un yia yia", "Toy mon y qui yia"], 1);
const l16q4 = new MCVocabularyQuestion("I want to have an alligator", ["Toy mon y qui un zung chungu", "Toy mon y qui un zung chungu y", "Toy mon y qui un zung chungu yia", "Toy mon y qui zung chungu"], 1);
const l16q5 = new AssemblingTranslationQuestion("I want to have a dog", ["Toy", "mon", "y", "qui", "un", "yio", "yia", "Goy"], "Toy mon y qui un yio.");
const l16q6 = new AudioHearQuestion("Toy qui un yio", "I have a dog");
// End Talk about yourself
// Food
const l17q1 = new MCVocabularyQuestion("Food", ["Treng", "Trong", "Xeet", "Xin"], 1);
const l17q2 = new MCVocabularyQuestion("Eat", ["Treng", "Trong", "Xeet", "Xin"], 3);
const l17q3 = new MCVocabularyQuestion("Eating", ["Treng", "Trong", "Xeet", "Xin"], 3);
const l17q4 = new MCVocabularyQuestion("Ate", ["Ruoua treng", "Ruoua trong", "Ruoua xeet", "Ruoua xin"], 3);
const l17q5 = new MCVocabularyQuestion("Toy xeet", ["I eat", "I ate", "I eating", "I do eat"], 1);
// NOTE: canza means apple
const l17q6 = new MCVocabularyQuestion("Toy xeet un canza", ["I eat an apple", "I ate an apple", "I eating an apple", "I do eat an apple"], 1);
// End Food
// Use conditional
const l18q1 = new MCVocabularyQuestion("If I have a dog", ["Le zi toy qui un yio", "Le zi toy qui un yia", "Le zi toy qui yio", "Le zi toy qui yia"], 1);
const l18q2 = new MCVocabularyQuestion("If I have a cat", ["Le zi toy qui un yia", "Le zi toy qui un yio", "Le zi toy qui un a yia", "Le zi toy qui yia"], 1);
// New words appear here
// Then = Chik
// Will = Ngoung
// Else = Xet
const l18q3 = new MCVocabularyQuestion("Then I will have a dog", ["Chik toy ngoung qui un yio", "Chik goy ngoung qui un yia", "Chik toy ngoung qui yio", "Chik goy ngoung qui yio"], 1);
const l18q4 = new MCVocabularyQuestion("Else I will have a cat", ["Xet toy ngoung qui un yia", "Xet goy ngoung qui un yio", "Xet toy ngoung qui yia", "Xet goy ngoung qui yia"], 1);
const l18q5 = new MCVocabularyQuestion("If I have a dog, then I will have a cat", ["Le zi toy qui un yio, chik toy ngoung qui un yia", "Le zi toy qui un yia, chik toy ngoung qui un yio", "Le zi toy qui yio, chik toy ngoung qui un yia", "Le zi toy qui yio, chik toy ngoung qui yia"], 1);
const l18q6 = new MCVocabularyQuestion("If I have a dog, then I will not have a cat, else I will have a cat", ["Le zi toy qui un yio, chik toy ngoung kyong qui un yia, xet toy ngoung qui un yia", "Le zi toy qui un yia, chik toy kyong ngoung qui un yia, xet toy ngoung qui un yia", "Le zi toy qui yio, chik toy ngoung qui yia, xet toy ngoung qui yia", "Le zi toy qui yio, chik toy ngoung qui yia, xet toy ngoung qui yia"], 1);
// End Use conditional
// Computer
const l19q1 = new MCVocabularyQuestion("Computer", ["Chamt lahn", "Chamt lahn y", "Lahn", "Chamt"], 1);
const l19q2 = new MCVocabularyQuestion("Chamt lahn ketoy", ["My computer", "My calculator", "My computer is not", "My computers"], 1);
const l19q3 = new MCVocabularyQuestion("Calculator", ["Chongo chamt", "Chongo chamt y", "Chamt", "Calca"], 1);
const l19q4 = new MCVocabularyQuestion("Chongo chamt ketoy", ["My calculator", "My computer", "My calculator is not", "My calculators"], 1);
const l19q5 = new AssemblingTranslationQuestion("My computer is not a calculator", ["Chamt", "lahn", "ketoy", "es", "kyong", "un", "chongo", "chamt", "lahn", "kegoy", "goy"], "Chamt lahn ketoy es kyong un chongo chamt.");
const l19q6 = new MCVocabularyQuestion("The calculator", ["Un chongo chamt", "Di chongo chamt", "Un chongo chamt yia", "Un chongo chamt yia y"], 2);
// End Computer
// Family
const l20q1 = new MCVocabularyQuestion("Family", ["Mapay", "Famya", "Fami", "Comma"], 1);
const l20q2 = new MCVocabularyQuestion("Toy qui un mapay", ["I have a family", "I do not have a family", "I have a family now", "I had a family"], 1);
const l20q3 = new AssemblingTranslationQuestion("I have a family", ["Toy", "qui", "un", "mapay", "yia", "yio", "goy"], "Toy qui un mapay.");
const l20q4 = new MCVocabularyQuestion("Toy ong qui un mapay", ["I have a family", "I do not have a family", "I have a family now", "I had a family"], 2);
const l20q5 = new AssemblingTranslationQuestion("I do not have a family", ["Toy", "ong", "qui", "un", "mapay", "yia", "yio", "goy", "toy"], "Toy ong qui un mapay.");
const l20q6 = new AudioHearQuestion("Yio", "Dog");
// End Family
// Hear the Word 2
const l21q1 = new AudioHearQuestion("Yio", "Dog");
const l21q2 = new AudioHearQuestion("Chong ketoy es chong kegoy", "My house is your house");
const l21q3 = new AudioHearQuestion("Chong kegoy", "Your house");
const l21q4 = new AudioHearQuestion("Chong ketoy", "My house");
const l21q5 = new AudioHearQuestion("Di chong ke-Yio", "The dog's house");
const l21q6 = new AudioHearQuestion("Chong ke-Karen", "Karen's house");
// End Hear the Word 2
// Animals 2
const l22q1 = new MCVocabularyQuestion("Animals", ["Gung zange", "Gung zangen", "Gung", "Zange"], 1);
const l22q2 = new MCVocabularyQuestion("Gung zange", ["Animals", "Animals are", "Animal", "Animals are not"], 1);
const l22q3 = new MCVocabularyQuestion("Zung chungu", ["Alligator", "Cat", "Venus fly trap", "Alligators"], 1);
const l22q4 = new MCVocabularyQuestion("Yia", ["Alligator", "Cat", "Venus fly trap", "Alligators"], 2);
const l22q5 = new AssemblingTranslationQuestion("I have an alligator", ["Toy", "qui", "un", "zung", "chungu", "gung", "toy", "Goy"], "Toy qui un zung chungu.");
const l22q6 = new MCVocabularyQuestion("Toy qui un zung chungu", ["I have an alligator", "I have a cat", "I have a Venus fly trap", "I have alligators"], 1);
// End Animals 2
// Simple Sentences 3
const l23q1 = new MCVocabularyQuestion("Tone", ["Tono", "Tutu", "Toney", "Tonu"], 2);
const l23q2 = new MCVocabularyQuestion("Tutu", ["Tone", "Tutu", "Toney", "Tonu"], 1, true);
const l23q3 = new MCVocabularyQuestion("Vietnamese is a tonal language", ["Vi lag viet es un tutu vi lag", "Vi lag viet es un tonu vi lag", "Vi lag viet es un toney vi lag", "Vi lag viet es un tono vi lag"], 1);
const l23q4 = new MCVocabularyQuestion("Qualleish is not a tonal language", ["Vi lag qualle es kyong un tutu vi lag", "Qualle es kyong un tutu vi lag", "Vi lag qualle es un tutu vi lag", "Chong ketoy es un tutu chong"], 1);
const l23q5 = new AssemblingTranslationQuestion("You are me", ["Goy", "khong", "toy", "Toy", "goy"], "Goy khong toy.");
const l23q6 = new AudioHearQuestion("Toy qui un chong", "I have a house");
// End Simple Sentences 3
// Describe a Person
const l24q1 = new MCVocabularyQuestion("You are weird", ["Goy khong choange", "Goy khi choange", "Choange khong goy", "Isla la", 1]);
const l24q2 = new AssemblingTranslationQuestion("Weird", ["Choange", "chong", "ketoy"], "Choange.");
 

const BASICS = new LessonInformation("Basics", [l1q1, l1q2, l1q3, l1q4, l1q5, l1q6]);
const BASICS_2 = new LessonInformation("Basics 2", [l2q1, l2q2, l2q3, l2q4, l2q5, l2q6]);
const INTRODUCE_YOURSELF = new LessonInformation("Introduce Yourself", [l3q1, l3q2, l3q3, l3q4, l3q5, l3q6]);
const NUMBERS = new LessonInformation("Numbers", [l4q1, l4q2, l4q3, l4q4, l4q5, l4q6]);
const USE_PLURALS = new LessonInformation("Use plurals", [l5q1, l5q2, l5q3, l5q4, l5q5, l5q6]);
const USE_PAST_TENSE = new LessonInformation("Use past tense", [l6q1, l6q2, l6q3, l6q4, l6q5, l6q6]);
const HEAR_THE_WORD = new LessonInformation("Hear the word", [l7q1, l7q2, l7q3, l7q4, l7q5, l7q6]);
const SIMPLE_SENTENCES = new LessonInformation("Simple sentences", [l8q1, l8q2, l8q3, l8q4, l8q5, l8q6]);
const SIMPLE_SENTENCES_2 = new LessonInformation("Simple sentences 2", [l9q1, l9q2, l9q3, l9q4, l9q5, l9q6]);
const USE_REAL_WORLD_NAMES = new LessonInformation("Use real world names", [l10q1, l10q2, l10q3, l10q4, l10q5, l10q6]);
const GREETINGS = new LessonInformation("Greetings", [l11q1, l11q2, l11q3, l11q4, l11q5, l11q6]);
const COUNTRIES = new LessonInformation("Countries", [l12q1, l12q2, l12q3, l12q4, l12q5, l12q6]);
const COUNTRIES_AND_LANGUAGES = new LessonInformation("Countries and Languages", [l13q1, l13q2, l13q3, l13q4, l13q5, l13q6]);
const WORK = new LessonInformation("Work", [l14q1, l14q2, l14q3, l14q4, l14q5, l14q6]);
const ANIMALS = new LessonInformation("Animals", [l15q1, l15q2, l15q3, l15q4, l15q5, l15q6]);
const TALK_ABOUT_YOURSELF = new LessonInformation("Talk about yourself", [l16q1, l16q2, l16q3, l16q4, l16q5, l16q6]);
const FOOD = new LessonInformation("Food", [l17q1, l17q2, l17q3, l17q4, l17q5, l17q6]);
const USE_CONDITIONAL = new LessonInformation("Use conditional", [l18q1, l18q2, l18q3, l18q4, l18q5, l18q6]);
const COMPUTER = new LessonInformation("Computer", [l19q1, l19q2, l19q3, l19q4, l19q5, l19q6]);
const FAMILY = new LessonInformation("Family", [l20q1, l20q2, l20q3, l20q4, l20q5, l20q6]);
const HEAR_THE_WORD_2 = new LessonInformation("Hear the word 2", [l21q1, l21q2, l21q3, l21q4, l21q5, l21q6]);
const ANIMALS_2 = new LessonInformation("Animals 2", [l22q1, l22q2, l22q3, l22q4, l22q5, l22q6]);
const SIMPLE_SENTENCES_3 = new LessonInformation("Simple sentences 3", [l23q1, l23q2, l23q3, l23q4, l23q5, l23q6]);


var CURRENT_LESSON = new LessonInformation('NULL', []);

const lessons = [BASICS, BASICS_2, INTRODUCE_YOURSELF, NUMBERS, USE_PLURALS, USE_PAST_TENSE, HEAR_THE_WORD, SIMPLE_SENTENCES, SIMPLE_SENTENCES_2,
    USE_REAL_WORLD_NAMES, GREETINGS, COUNTRIES, COUNTRIES_AND_LANGUAGES, WORK, ANIMALS, TALK_ABOUT_YOURSELF, FOOD, USE_CONDITIONAL,
    COMPUTER, FAMILY, HEAR_THE_WORD_2, ANIMALS_2, SIMPLE_SENTENCES_3];
ReactDOM.render(
    <AppDisplay />,
    document.getElementById('root')
);