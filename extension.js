// Object.defineProperty(exports, "__esModule", { value: true })

const vscode = require("vscode")

function activate(context) {

    vscode.languages.registerDocumentFormattingEditProvider('saker', {

        provideDocumentFormattingEdits(document) {
            let output = []
            let indentCount = 0

            for (let lineIndex = 0; lineIndex < document.lineCount; lineIndex++) {

                let line = document.lineAt(lineIndex)
                let whitespaceLength = 0
                let whitespaceMatch = line.text.match(/^\s*/)

                let openBrackets = line.text.match(/<[^\/|!][^>]*[^\/]>|<(?!.*\/?>)|{/g)
                let closeBrackets = line.text.match(/<\/\w+>|}/g)
                let closeAfter = false

                if (whitespaceMatch) {
                    whitespaceLength = whitespaceMatch[0].length
                }

                let open = openBrackets ? openBrackets.length : 0
                let close = closeBrackets ? closeBrackets.length : 0

                if (open - close < 0)
                    indentCount += open - close

                if (indentCount < 0) indentCount = 0
                let start = new vscode.Position(lineIndex, 0)
                let end = new vscode.Position(lineIndex, whitespaceLength)
                let indentation = '    '.repeat(indentCount)
                let edit = vscode.TextEdit.replace(new vscode.Range(start, end), indentation)

                if (open - close > 0)
                    indentCount += open - close

                output.push(edit)
            }

            return output
        }
    })
}

exports.activate = activate