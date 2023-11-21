<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Celke - Upload e ler pdf</title>
</head>

<body>

    <h2>Ler arquivo PDF</h2>

    <!-- Início do formulário enviar arquivo PDF -->
    <form method="POST" action="" enctype="multipart/form-data">
        <label>Arquivo PDF: </label>
        <input type="file" name="arquivo" accept="application/pdf"><br><br>

        <input type="submit" name="btn-enviar-pdf" value="Enviar"><br><br>
    </form>
    <!-- Fim do formulário enviar arquivo PDF -->

    <?php

    // Receber os dados do formulário
    $dados = filter_input_array(INPUT_POST, FILTER_DEFAULT);

    // Acessa o IF quando o usuário clicar no botão Enviar
    if (!empty($dados['btn-enviar-pdf'])) {
        // Receber o arquivo enviado através do formulário
        $arquivo = $_FILES['arquivo'];
        //var_dump($arquivo);

        // Validar o arquivo verificando se o mesmo é PDF
        if ($arquivo['type'] != 'application/pdf') {
            echo "<p style='color: #f00;'>Erro: Necessário enviar arquivo PDF!</p>";
        } else {
            // Criar novo nome para o arquivo PDF
            $renomear_arquivo = md5(time()) . '.pdf';

            // Caminho para o upload
            $caminho_upload = "arquivos/";

            // Realizar upload do arquivo
            if (move_uploaded_file($arquivo['tmp_name'], $caminho_upload . $renomear_arquivo)) {
                // Chamar a função ler o texto do PDF e enviar como parâmetro o endereço do arquivo
                lerPDF($caminho_upload . $renomear_arquivo);
            } else {
                echo "<p style='color: #f00;'>Erro: Arquivo não enviado!</p>";
            }
        }
    }

    function lerPDF($caminho_arquivo){
        //echo "Ler o PDF: $caminho_arquivo <br>";

        // Carregar o Composer
        require './vendor/autoload.php';

        // Instanciar a classo ler conteúdo do PDF
        $parser = new \Smalot\PdfParser\Parser();

        // Chamar o método e enviar o arquivo
        $pdf = $parser->parseFile($caminho_arquivo);

        // ********* INICIO QUEBRA A LINHA APÓS PÁGINA NOVA PDF *********
        // Recuperar o texto do PDF
        //$text = $pdf->getText();

        // Imprimir o texto do PDF
        // nl2br — Insere quebras de linha HTML antes de todas quebra de linha em uma string
        //echo nl2br($text);
        // ********* FIM QUEBRA A LINHA APÓS PÁGINA NOVA PDF *********

        // ********* INICIO SEM QUEBRA A LINHA APÓS PÁGINA NOVA PDF *********
        // Recuperar as páginas do arquivo PDF
        $pages = $pdf->getPages();

        // Criar o loop para percorrer cada página para extrair o texto.
        foreach($pages as $page){
            // Recuperar o texto do PDF
            // nl2br — Insere quebras de linha HTML antes de todas quebra de linha em uma string
            // PHP_EOL - forçar quebra de linha na visualização
            echo nl2br($page->getText() . PHP_EOL);
        }

        // ********* FIM SEM QUEBRA A LINHA APÓS PÁGINA NOVA PDF *********
    }

    ?>

</body>

</html>