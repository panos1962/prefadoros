Σε αυτό το directory φορτώνονται files από τον παίκτη
www.prefadoros.gr με σκοπό να υποκαταστήσουμε το FTP.
Το directory πρέπει να έχει full permissions για όλους.

Όταν θέλουμε να φορτώσουμε κάποιο αρχείο (zip file),
κάνουμε login ως www.prefadoros.gr και δοκιμάζουμε να
ανεβάζουμε ως αρχείο εικόνας (avatar) το zip file που
επιθυμούμε. Τότε αυτό το αρχείο "ανεβαίνει" ως "UPLOAD.zip"
στο directory "upload". Κατόπιν ακολουθεί μάλλον:

	unzip -qo upload/UPLOAD.zip

και εγκαθίστανται τα files που περιέχονται στο zip αρχείο.
