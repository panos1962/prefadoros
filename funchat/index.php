<?php
require_once '../lib/standard.php';
require_once '../lib/pektis.php';
set_globals();
Page::head();
Page::stylesheet('funchat/funchat');
Page::javascript('funchat/funchat');
?>
</head>
<body onresize="funchat.whltSave();">
<?php
if (Session::is_set('ps_whlt')) {
	if (preg_match('/^[0-9]+:[0-9]+:[0-9]+:[0-9]+$/', $_SESSION['ps_whlt'])) {
		$whlt = explode(':', $_SESSION['ps_whlt']);
		?>
		<script type="text/javascript">
			window.self.resizeTo(<?php print $whlt[0]; ?>, <?php print $whlt[1]; ?>);
			window.self.moveTo(<?php print $whlt[2]; ?>, <?php print $whlt[3]; ?>);
			setTimeout(function() {
				funchat.whltSaveUnblocked = true;
			}, 500);
		</script>
		<?php
	}
}
print_panel();
Page::close(FALSE);

class Item {
	public $image;
	public $title;

	public function __construct($image, $title = '', $zoom = '', $sound = '') {
		$this->image = $image;
		$this->title = $title;
		$this->zoom = $zoom;
		$this->sound = $sound;
	}

	public function show() {
		global $globals;
		$host = 'http://www.pineza.info/prefa/images/gallery/';
		$title = str_replace("'", "\\'", $this->title);
		?>
		<div class="funchat"
			<?php
			if ($this->sound != '') {
				?>
				title="Έχει και ήχο!"
				<?php
			}
			/*
			if ($globals->is_trapezi()) {
				?>
				onclick="addSxolio('<?php print $host . $this->image; ?>', '<?php
					print $title; ?>', '<?php print $this->zoom;
					?>', '<?php print $this->sound; ?>');" style="cursor: pointer;"
				<?php
			}
			*/
			?>>
			<?php
			if ($this->sound != '') {
				?>
				<img class="funchatSound" src="<?php
					print $globals->server; ?>images/controlPanel/entasi.png"
					alt="" />
				<?php
			}
			?>
			<div>
				<img src="<?php print $host . $this->image; ?>"
					class="funchatImage" alt="<?php
					print $this->title; ?>" />
			</div>
			<div class="funchatTitle">
				<?php print $this->title; ?>
			</div>
		</div>
		<?php
	}
}

function print_panel() {
	global $globals;

	$item_list = array();

	$item_list[] = new Item("bearFace.gif", "Βγάλαμε κανένα μάτι;");
	$item_list[] = new Item("oliEfxaristimeni.gif", "Όλοι ευχαριστημένοι!");
	$item_list[] = new Item("viziaPanoKato.gif", "Με βγάλατε!");
	$item_list[] = new Item("vgika.gif", "Βγήκα!");
	$item_list[] = new Item("viziaKatoPano.gif", "Θα περάσουμε ωραία…");
	$item_list[] = new Item("ObamaClapping.gif", "Μπράβο, μπράβο…");
	$item_list[] = new Item("thimisouReMalaka.gif", "Χμ…");
	$item_list[] = new Item("stroumfaki.gif", "Α, χα, χα, χαααα!");
	$item_list[] = new Item("haHaHa.gif");
	$item_list[] = new Item("xekardismenoEmoticon.gif");
	$item_list[] = new Item("gelia.gif", "Ε, ρε γέλια που θα κάνουμε!");
	$item_list[] = new Item("boxingCat.gif", "Πάμε να τον χώσουμε βαθειά!");
	$item_list[] = new Item("crossEye.jpg", "Τι κάνεις, ρε;;;");
	$item_list[] = new Item("assWiggle.gif", "Ε, ρε γλέντια!");
	$item_list[] = new Item("malakiaSinefo.gif", "Η μαλακία πάει σύννεφο…");
	$item_list[] = new Item("tinExoPsonisi.gif", "Την έχω ψωνίσει τώρα!");
	$item_list[] = new Item("thaMasKlasisTarxidia.gif", "Θα μας κλάσεις τα @@!");
	$item_list[] = new Item("lesNaBgo.gif", "Λές να βγω;");
	$item_list[] = new Item("ouReKole.gif", "Ου, ρε κώλε!");
	$item_list[] = new Item("ftaniPia.gif", "Έλεος! Δεν αντέχω άλλο…");
	$item_list[] = new Item("exeteXesti.gif", "Έχετε χεστεί, ρε σεις!");
	$item_list[] = new Item("etsiKeBoMesa.gif", "Έτσι και μπω μέσα…");
	$item_list[] = new Item("deGinonteAfta.gif", "Ε, όχι, ρε σεις! Δεν γίνονται αυτά…");
	$item_list[] = new Item("anteGamithiteRe.gif", "Ε, άντε γαμηθείτε, ρε κουφάλες…");
	$item_list[] = new Item("mesa.gif", "Το θέμα είναι απλά ή σόλο;");
	$item_list[] = new Item("pexeKala.gif", "Παίξε καλά, ρε συ!");
	$item_list[] = new Item("meSkisate.gif", "Μ' έχετε ξεσκίσει, ρε!");
	$item_list[] = new Item("tiGamisesTinPartida.gif", "Γάμησες την παρτίδα!");
	$item_list[] = new Item("mesaItan.gif", "Μέσα ήταν, ρε!");
	$item_list[] = new Item("meTipota.gif", "Με τίποτα!");
	$item_list[] = new Item("oxiRePoustiMou.gif", "Όχι, ρε Πού(σ)τιν μου…");
	$item_list[] = new Item("tiKanisRePoutinMou.gif", "Τι κάνεις, ρε Πούτιν μου…");
	$item_list[] = new Item("koupitses.png", "Κουπίτσες μαλακές…");
	$item_list[] = new Item("koupitses.png", "Κούπες και οι φίλοι να αποσύρονται…");
	$item_list[] = new Item("thaGiniMaxi.gif", "Θα γίνει μάχη!");
	$item_list[] = new Item("iseTromeros.gif");
	$item_list[] = new Item("gamisaki.gif");
	$item_list[] = new Item("catFire.gif");
	$item_list[] = new Item("fayeGun.gif");
	$item_list[] = new Item("komanto.gif");
	$item_list[] = new Item("shooter.gif");
	$item_list[] = new Item("exeteAso.gif", "Έχετε κάποιον άσο;");
	$item_list[] = new Item("dueto.gif", "Χορεύετε;", 0.9);
	$item_list[] = new Item("mazi.gif", "Πάμε μαζί;");
	$item_list[] = new Item("soloDance.gif", "Το 'παιξα ωραία!");
	$item_list[] = new Item("zito.gif", "Ζήτω!");
	$item_list[] = new Item("poulaki.gif", "Καμιά μπάζα πουθενά;");
	$item_list[] = new Item("ipoklinome.gif", "Υποκλίνομαι!");
	$item_list[] = new Item("kaneMonozigo.gif", "Κάνε τον ακροβάτη τώρα…");
	$item_list[] = new Item("mikrosIseAkoma.gif", "Μικρός είσαι ακόμη. Θα μάθεις.");
	$item_list[] = new Item("bebisEmoticon.gif");
	$item_list[] = new Item("oliOk.gif", "Όλοι ευχαριστημένοι!");
	$item_list[] = new Item("prosexe.gif", "Πρόσεχε!");
	$item_list[] = new Item("mrBean.gif", "", 4.6);
	$item_list[] = new Item("tinExoStisi.gif", "Την έστησα.");
	$item_list[] = new Item("maziCats.gif", "Πάμε μαζί, αγαπούλα;");
	$item_list[] = new Item("tinEstise.gif", "Την έστησε!!!");
	$item_list[] = new Item("tromosEmoticon.gif");
	$item_list[] = new Item("kota.gif", "Κότα…");
	$item_list[] = new Item("tinEstisa.gif", "Την έστησα…");
	$item_list[] = new Item("koronaGramata.gif", "Το 'παιξα στην τύχη.");
	$item_list[] = new Item("gemisaKapikia.gif", "Γέμισα καπίκια!");
	$item_list[] = new Item("telia.gif");
	$item_list[] = new Item("thaVgaloMati.gif", "Θα βγει κανένα μάτι;");
	$item_list[] = new Item("gavosEmoticon.gif", "Θα στραβωθώ ρε!");
	$item_list[] = new Item("vgaleMati.gif", "Θα μου βγάλεις το μάτι;");
	$item_list[] = new Item("meTrelanes.gif", "Με τρέλανες τώρα!");
	$item_list[] = new Item("efkoloItan.gif", "Όχι να το παινευτώ, αλλά είμαι μάστορας.", 2.0);
	$item_list[] = new Item("dikeoma.gif", "Δικαίωμα…");
	$item_list[] = new Item("skeptikoArkoudi.gif");
	$item_list[] = new Item("vadinSkifto.gif", "Δύσκολο…");
	$item_list[] = new Item("denTsimpao.gif", "Δεν τσιμπάω ρε!");
	$item_list[] = new Item("elaStoThio.gif", "Έλα στο θείο!");
	$item_list[] = new Item("helloBird.gif");
	$item_list[] = new Item("filaki.gif", "Να σε φιλήσω!");
	$item_list[] = new Item("iLoveYou.gif");
	$item_list[] = new Item("piosPezi.gif", "Ε, ποιος παίζει;");
	$item_list[] = new Item("petamaKitapi.gif", "Δες τα χάλια σου στο κιτάπι…");
	$item_list[] = new Item("noCommentEmoticon.gif");
	$item_list[] = new Item("souromenosIse.gif", "Σουρωμένος είσαι;");
	$item_list[] = new Item("tiSasExo.gif", "Τι σας έχω, τι σας έχω!");
	$item_list[] = new Item("kremastika.gif", "Κρεμάστηκα τώρα!");
	$item_list[] = new Item("xipna.gif", "Ξύπνα, ρεεεε!");
	$item_list[] = new Item("bartAss.gif", "Kiss my ass!");
	$item_list[] = new Item("mafalda.gif", "Παίξτο ανέμελα…");
	$item_list[] = new Item("toraTiKano.gif", "Τώρα;");
	$item_list[] = new Item("oniropoloEmoticon.gif", "Λες η τύχη να είναι μαζί μου;");
	$item_list[] = new Item("lesEmoticon.gif", "Λες;");
	$item_list[] = new Item("xmEmoticon.gif");
	$item_list[] = new Item("aporiaPokemon.gif");
	$item_list[] = new Item("giatiEpexes.gif", "Γιατί έπαιξες, ρε συ;");
	$item_list[] = new Item("pleaseEmoticon.gif", "Παίξε μια φορά σωστά…");
	$item_list[] = new Item("oxiReSi.gif", "Όχι ρε Πούτιν μου…");
	$item_list[] = new Item("alithoros.jpg", "Τώρα τα είδα όλα!");
	$item_list[] = new Item("ouranosSfontili.gif");
	$item_list[] = new Item("kinezos.gif");
	$item_list[] = new Item("snoopy.gif", "Τρέλα!");
	$item_list[] = new Item("goofy.jpg", "Τώρα μας τρέλανες!");
	$item_list[] = new Item("voutes.gif", "Άρχισες τις βούτες πάλι;");
	$item_list[] = new Item("vatraxos.gif", "Τζα!");
	$item_list[] = new Item("gunPenis.gif", "", 7.8);
	$item_list[] = new Item("daffyPhone.gif", "Μισό λεπτό. Μιλάω στο τηλέφωνο…");
	$item_list[] = new Item("spiderman.gif", "Παιχταράς είμαι!");
	$item_list[] = new Item("michaelJackson.gif", "Είμαι μεγάλος μάστορας!");
	$item_list[] = new Item("imeApisteftos.gif", "Είμαι απίστευτος!");
	$item_list[] = new Item("xorosSpagato.gif", "Είμαι μεγάλος παίκτης!");
	$item_list[] = new Item("isePextaras.gif", "Είσαι παιχταράς!", 1.0);
	$item_list[] = new Item("iseTerastios.gif", "Είσαι τεράστιος!");
	$item_list[] = new Item("axtipitoDidimo.gif", "Είμαστε αχτύπητο δίδυμο!");
	$item_list[] = new Item("thankYou.gif");
	$item_list[] = new Item("cheersEmoticon.gif");
	$item_list[] = new Item("mikiMaous.gif");
	$item_list[] = new Item("soreos.gif", "Σωραίος…");
	$item_list[] = new Item("katapliktiko.gif", "Καταπληκτικό!");
	$item_list[] = new Item("trelathikaTora.gif", "Τρελάθηκα τώρα!");
	$item_list[] = new Item("ohMyGod.gif");
	$item_list[] = new Item("tiNaEkana.gif", "Τι να έκανα, ρε συ;", 2.0);
	$item_list[] = new Item("tiNaSouPoTora.gif", "Τι να σου πω τώρα;", 2.0);
	$item_list[] = new Item("etsi.gif", "Έεεεετσι!");
	$item_list[] = new Item("tromaxaNaTiVgalo.gif", "Τρόμαξα να βγω, ρε σεις…");
	$item_list[] = new Item("denKratieme.gif", "Δεν κρατιέμαι!");
	$item_list[] = new Item("epikindino.gif", "Επικίνδυνο…");
	$item_list[] = new Item("daffyMalakas.gif", "Τρόμπας είσαι;");
	$item_list[] = new Item("toblerone.jpg", "Τον πλέρωνε…");
	$item_list[] = new Item("misoLepto.gif", "Μισό…");
	$item_list[] = new Item("ekplixiEmoticon.gif");
	$item_list[] = new Item("pexeBala.gif", "Παίξε μπάλα ρε!");
	$item_list[] = new Item("pipaKolo.gif", "Πίπα κώλο μας πάει…");
	$item_list[] = new Item("tonIpiame.gif", "Τον ήπιαμε!");
	$item_list[] = new Item("pipaKaroto.gif");
	$item_list[] = new Item("pipa.gif", "Πίπα, όπως λέμε Φελίπα…");
	$item_list[] = new Item("fuckYou.gif");
	$item_list[] = new Item("dontiToulipa.gif");
	$item_list[] = new Item("klamaEmoticon.gif");
	$item_list[] = new Item("klapsEmoticon.gif", "Κλαψ…");
	$item_list[] = new Item("tsopaTsopa.gif", "Τσώπα, τσώπα…");
	$item_list[] = new Item("matakiaEnoxa.gif", "", 1.4);
	$item_list[] = new Item("kokinizo.gif");
	$item_list[] = new Item("meKitasPouSeKitao.gif", "Μήπως βγω έτσι;");
	$item_list[] = new Item("palamakiaEmoticon.gif", "Παραδέχομαι…");
	$item_list[] = new Item("binelikia.gif", "Δεν αντέχω τα μπινελίκια!");
	$item_list[] = new Item("bravoEmoticon.gif");
	$item_list[] = new Item("klotsiaArxidia.gif");
	$item_list[] = new Item("taXoni.gif");
	$item_list[] = new Item("gelioEmoticon.gif", "Πλάκα έχετε…", 1.4);
	$item_list[] = new Item("lolEmoticon.gif");
	$item_list[] = new Item("no.gif");
	$item_list[] = new Item("nop.gif");
	$item_list[] = new Item("alwaysSmile.gif");
	$item_list[] = new Item("vgikaPapaki.gif", "Εγώ βγήκα πάντως…");
	$item_list[] = new Item("bingoPokemon.gif", "Σωστόοοοστ!");
	$item_list[] = new Item("kalaPouMePires.gif", "Καλά που με πήρες!");
	$item_list[] = new Item("egiptiakosXoros.gif");
	$item_list[] = new Item("kalimeraEmoticon.gif");
	$item_list[] = new Item("helloEmoticon.gif");
	$item_list[] = new Item("hiPokemon.gif");
	$item_list[] = new Item("ILoveUEmoticon.gif");
	$item_list[] = new Item("tragoudiEmoticon.gif", "Θα μας τραγουδήσεις κάτι;");
	$item_list[] = new Item("koutsoTripa.gif", "Πρόσεχε τις λούμπες!");
	$item_list[] = new Item("minBisMesa.gif", "Ένα, δύο, τρία και… Ουπς!");
	$item_list[] = new Item("migaki.gif", "Μια μύγα!");
	$item_list[] = new Item("chuckNoris.jpg", "Ούτε εγώ δεν τις βγάζω αυτές!");
	$item_list[] = new Item("moxthiroEmoticon.gif");
	$item_list[] = new Item("kobra.gif");
	$item_list[] = new Item("sfiriEmoticon.gif", "Θα το σπάσω!!!");
	$item_list[] = new Item("astrapesEmoticon.gif", "@#!%@^&#*!@");
	$item_list[] = new Item("bounidiEmoticon.gif", "Άμα σ' αρχίσω τώρα στα μπουνίδια θα φταίω;");
	$item_list[] = new Item("giatiMePires.gif", "Εγώ γιατί σε πήρα, ρε;", 1.6);
	$item_list[] = new Item("limaExo.gif", "Έχω πήξει στο λιμό…");
	$item_list[] = new Item("seLatrevo.gif", "Σε λατρεύω!");
	$item_list[] = new Item("ouraKoutavi.gif");
	$item_list[] = new Item("prasiniGlosa.gif");
	$item_list[] = new Item("youCanDoIt.gif", "", 1.6);
	$item_list[] = new Item("tirakiEmoticon.gif", "Το τυράκι το είδες. Τη φάκα όμως;");
	$item_list[] = new Item("victoryEmoticon.gif", "Με τη νίκη!", 1.0);
	$item_list[] = new Item("nistaxa.gif", "Νύσταξα, ρε σεις…");
	$item_list[] = new Item("goodNight.gif");
	$item_list[] = new Item("ipnosEmoticon.gif", "Κοιμήθηκα…");
	$item_list[] = new Item("fevgoPedia.gif", "Φεύγω παιδιά!");
	$item_list[] = new Item("flag.gif", "Μοιράζω και φεύγω!");
	$item_list[] = new Item("bye.gif");
	$item_list[] = new Item("ouranosSfontili.gif", "Ωχ!", "", "doing");
	$item_list[] = new Item("klania.gif", "Σόρι παιδιά…", "", "klania");

/*
	if ($globals->is_pektis() && ($globals->pektis->login == 'panos')) {
		$item_list[] = new Item("panosPrefadoros.jpg", "Γειά χαρά!");
		$item_list[] = new Item("panosAngry.jpg", "Θα μου κλάσεις τα @@!");
		$item_list[] = new Item("laptopEmoticon.gif", "Κωλόφυλλο έχω. Θα το χακέψω λίγο…");
		$item_list[] = new Item("piramaEmoticon.gif", "Λέω να κάνω ένα πείραμα…");
		$item_list[] = new Item("vivlioEmoticon.gif", "Κάτσε να δω τι λέει ο Σαραντάκος " .
			"γι αυτή την περίπτωση…");
	}
*/

	?>
	<?php
	$cnt = count($item_list);
	for ($i = 0; $i < $cnt; $i++) {
		$item_list[$i]->show();
	}
	?>
	<div id="checkAlive" style="width: 2.9cm; float: none;">&nbsp;</div>
	<?php
}
