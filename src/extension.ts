import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Undo Cursor Fixer active');

    // Seçimi saklamak için değişken
    let lastSelections: vscode.Selection[] = [];

    // Undo öncesi imleç konumunu sürekli güncelle
    vscode.window.onDidChangeTextEditorSelection((e) => {
        if (e.textEditor === vscode.window.activeTextEditor) {
            lastSelections = e.selections.map(sel => new vscode.Selection(sel.start, sel.end));
        }
    });

    // Doküman değiştiğinde (Undo dahil)
    const disposable = vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || event.document !== editor.document) return;

        if (event.reason === vscode.TextDocumentChangeReason.Undo && lastSelections.length > 0) {
            // Undo’ya izin ver → VS Code istediğini yapsın
            setTimeout(() => {
                try {
                    editor.selections = lastSelections;
                    editor.revealRange(new vscode.Range(
                        lastSelections[0].active, lastSelections[0].active
                    ));
                } catch { /* boşver */ }
            }, 150); // 150 ms sonra geri al (gerekirse artır/azalt)
        }
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
