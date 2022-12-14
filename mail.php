<?php

$txt = '';

//В переменную $token нужно вставить токен, который нам прислал @botFather
$token = "1713350875:AAG4PAfJYXYt9GOr5gWDJw8j2qHB22GCy1Y";

//Сюда вставляем chat_id
$chat_id = "-511444047";

//Определяем переменные для передачи данных из нашей формы
if ($_POST['act'] == 'order') {
    $name = ($_POST['name']);
    $phone = ($_POST['phone']);
    $text = ($_POST['text']);

//Собираем в массив то, что будет передаваться боту
    $arr = array(
        'Имя:' => $name,
        'Телефон:' => $phone,
        'Текст:' => $text
    );

//Настраиваем внешний вид сообщения в телеграме
    foreach($arr as $key => $value) {
        $txt .= "<b>".$key."</b> ".$value."%0A";
    };

//Передаем данные боту
    $sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");

//Выводим сообщение об успешной отправке
    if ($sendToTelegram) {
        header("Location: page-complete.html");
        //alert('Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.');
    }

//А здесь сообщение об ошибке при отправке
    else {
        //alert('Что-то пошло не так. ПОпробуйте отправить форму ещё раз.');
    }
}

?>