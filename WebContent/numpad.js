function number_write(x) {
	var text_box = $("withdraw_amount");
	if (x >= 0 && x <= 9) {
		if (isNaN(text_box.value))
			text_box.value = 0;
		text_box.value = (text_box.value * 10) + x;
	}
}


function number_c() {
	var text_box = $("withdraw_amount");
	var num = text_box.value;
	var num1 = num % 10;
	num -= num1;
	num /= 10;
	text_box.value = num;
}