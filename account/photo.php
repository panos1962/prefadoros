<?php

// Κατά την εγγραφή, όπως επίσης και κατά τη είσοδο των παικτών
// ελέγχεται αν υπάρχει αρχείο εικόνας για τον παίκτη και αν δεν
// υπάρχει δημιουργείται από το "nophoto.png". Κατόπιν ο παίκτης
// μπορεί να αλλάξει τη φωτογραφία του.

function check_photo($login, $path = "../") {
	$base = $path . "photo/" . strtolower(substr($login, 0, 1));
	$photo = $base . "/" . $login . ".jpg";
	if (!file_exists($photo)) {
		@mkdir($base, 0777);
		@copy($path . "images/nophoto.png", $photo);
	}
}
?>
