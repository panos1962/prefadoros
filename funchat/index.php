<?php
require_once '../lib/standard.php';
require_once '../pektis/pektis.php';
require_once '../trapezi/trapezi.php';
require_once '../prefadoros/prefadoros.php';
set_globals();
Prefadoros::set_pektis();
Prefadoros::set_trapezi();
Page::head();
Page::stylesheet('funchat/funchat');
Page::javascript('funchat/funchat');
?>
</head>
<body onresize="funchat.whltSave();">
<div>
<table>
<tr>
<td>
<div class="funchatPrompt">
URL εικόνας
</div>
</td>
<td>
<input id="inputURL" type="text" value="" size="20"
	maxlength="4096" onkeyup="Ikona.keyCheck(event, this);" />
<button type="button" onclick="Ikona.preview(0.5);">+</button>
<button type="button" onclick="Ikona.preview(-0.5);">&ndash;</button>
<button type="button" onclick="Ikona.stile();">Send!</button>
<button type="button" onclick="Ikona.akiro();">Άκυρο</button>
</td>
</tr>
<tr>
<td>
<div class="funchatPrompt">
Λεζάντα
</div>
</td>
<td>
<input id="inputLezanta" type="text" value="" size="50"
	maxlength="4096" onkeyup="Ikona.keyCheck(event, this);" />
<div id="inputSxolioArea" class="funchatSxolioArea">
	<input id="inputSxolio" type="text" value="" size="40"
		maxlength="4096" onkeyup="Funchat.keyCheck(event, this);"
		style="margin-bottom: 0.4cm; font-size: 0.40cm;" />
	<div>
	<button type="button" class="button" onclick="return Funchat.apostoli();"
		style="margin-right: 1.0cm;">Αποστολή</button>
	<button type="button" class="button" onclick="return Funchat.clear();">Ακύρωση</button>
	</div>
</div>
</td>
</tr>
</table>
<input id="ikonaData" type="hidden" value="" />
</div>
<?php
if (Globals::session_set('ps_whlt')) {
	if (preg_match('/^[0-9]+:[0-9]+:[0-9]+:[0-9]+$/', $_SESSION['ps_whlt'])) {
		$whlt = explode(':', $_SESSION['ps_whlt']);
		?>
		<script type="text/javascript">
			funchat.whltSaveBlocked = true;
			window.self.resizeTo(<?php print $whlt[0]; ?>, <?php print $whlt[1]; ?>);
			window.self.moveTo(<?php print $whlt[2]; ?>, <?php print $whlt[3]; ?>);
			setTimeout(function() {
				funchat.whltSaveBlocked = false;
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
	public $zoom;
	public $sound;

	// Το πεδίο του ήχου έχει τη μορφή "ήχος[:καθυστέρηση[:ένταση]]", π.χ.
	// "tzamia:1500:40", όπου η καθυστέρηση είναι σε milliseconds και
	// η ένταση είναι ένας ακέραιος, π.χ. 20, 30 κλπ, παρόμοιος με αυτόν
	// που χρησιμοποιείται από την "playSound". Αν δεν δοθεί καθυστέρηση
	// υποτίθεται μηδενική (χωρίς καθυστέρηση), ενώ αν δεν δοθεί ένταση
	// χρησιμοποιείται η default τιμή του συγκεκριμένου ήχου, όπως αυτή
	// ορίζεται στο "lib/soundmanager.js"
	//
	// 05-11-2011
	// ==========
	// Το πεδίο ήχου μπορεί πλέον να δέχεται YouTube διευθύνσεις. Εφόσον
	// το πρόγραμμα εντοπίσει διεύθυνση YouTube στο πεδίο ήχου, προβάλλει
	// το video με autoplay. Αυτό γίνεται μέσω της αποκωδικοποίησης των
	// σχολίων στο prefadoros/sizitisi.js (Sizitisi::funchatDecode()).

	public function __construct($image = '', $title = '', $zoom = '', $sound = '') {
		$this->image = $image;
		$this->title = $title;
		$this->zoom = $zoom;
		$this->sound = $sound;
	}

	public function show() {
		global $globals;
		$title = str_replace("'", "\\'", $this->title);
		?>
		<div class="funchat"
			<?php
			if ($this->sound != '') {
				?>
				title="Έχει και ήχο!"
				<?php
			}
			if ($globals->is_trapezi()) {
				?>
				onclick="Funchat.stile(event, this, '<?php print $this->image; ?>', '<?php
					print $title; ?>', '<?php print $this->zoom;
					?>', '<?php print $this->sound; ?>');" style="cursor: pointer;"
				<?php
			}
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
			<?php
			if ($this->image != '') {
				?>
				<img src="<?php print FUNCHAT_SERVER . $this->image;
					?>" class="funchatImage" alt="<?php
					print $this->title; ?>" />
				<?php
			}
			else {
				?>
				<div class="funchatXorisIkona">
					Χωρίς<br />εικόνα
				</div>
				<?php
			}
			?>
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

	$item_list[] = new Item("helloEmoticon.gif");
	$item_list[] = new Item("hiPokemon.gif");
	$item_list[] = new Item("misoLepto.gif", "Μισό…", 3.2);
	$item_list[] = new Item("daffyPhone.gif", "Μισό λεπτό. Μιλάω στο τηλέφωνο…", 3.0);
	$item_list[] = new Item("ImBack.gif", "");
	$item_list[] = new Item("viziaKatoPano.gif", "Θα περάσουμε ωραία…", 3.2);
	$item_list[] = new Item("boxingCat.gif", "Πάμε να τον χώσουμε βαθειά!", 5.2);
	$item_list[] = new Item("crossEye.jpg", "Τι κάνεις, ρε;;;", 4.4);
	$item_list[] = new Item("assWiggle.gif", "Ε, ρε γλέντια!", 4.0);
	$item_list[] = new Item("thaMasKlasisTarxidia.gif", "Θα μας κλάσεις τα @@!");
	$item_list[] = new Item("ouReKole.gif", "Ου, ρε κώλε!", 5.2);
	$item_list[] = new Item("exeteXesti.gif", "Έχετε χεστεί, ρε σεις!", 4.2);
	$item_list[] = new Item("etsiKeBoMesa.gif", "Έτσι και μπω μέσα…", 4.2);
	$item_list[] = new Item("deGinonteAfta.gif", "Ε, όχι, ρε σεις! Δεν γίνονται αυτά…", 3.2);
	$item_list[] = new Item("anteGamithiteRe.gif", "Ε, άντε γαμηθείτε, ρε κουφάλες…", 4.8);
	$item_list[] = new Item("mesa.gif", "Το θέμα είναι απλά ή σόλο;");
	$item_list[] = new Item("pexeKala.gif", "Παίξε καλά, ρε συ!", 5.0);
	$item_list[] = new Item("meSkisate.gif", "Μ' έχετε ξεσκίσει, ρε!", 3.6);
	$item_list[] = new Item("tiGamisesTinPartida.gif", "Γάμησες την παρτίδα!", 3.8);
	$item_list[] = new Item("mesaItan.gif", "Μέσα ήταν, ρε!", 5.0);
	$item_list[] = new Item("oxiRePoustiMou.gif", "Όχι, ρε Πούτιν μου…", 4.6);
	$item_list[] = new Item("tiKanisRePoutinMou.gif", "Τι κάνεις, ρε Πούτιν μου…", 5.2);
	$item_list[] = new Item("thaGiniMaxi.gif", "Θα γίνει μάχη!");
	$item_list[] = new Item("gamisaki.gif");
	$item_list[] = new Item("catFire.gif");
	$item_list[] = new Item("fayeGun.gif", "", 4.8, "polivolo");
	$item_list[] = new Item("komanto.gif");
	$item_list[] = new Item("shooter.gif", "", "", "pistolia");
	$item_list[] = new Item("exeteAso.gif", "Έχετε κάποιον άσο;");
	$item_list[] = new Item("soloDance.gif", "Το 'παιξα ωραία!");
	$item_list[] = new Item("zito.gif", "Ζήτω!", 5.2);
	$item_list[] = new Item("poulaki.gif", "Καμιά μπάζα πουθενά;");
	$item_list[] = new Item("ipoklinome.gif", "Υποκλίνομαι!");
	$item_list[] = new Item("mikrosIseAkoma.gif", "Μικρός είσαι ακόμη. Θα μάθεις.", 2.2);
	$item_list[] = new Item("bebisEmoticon.gif");
	$item_list[] = new Item("oliEfxaristimeni.gif");
	$item_list[] = new Item("oliOk.gif", "Όλοι ευχαριστημένοι!");
	$item_list[] = new Item("mrBean.gif", "", 4.6);
	$item_list[] = new Item("mazi.gif", "Πάμε μαζί;", 3.8);
	$item_list[] = new Item("maziCats.gif", "Πάμε μαζί, αγαπούλα;");
	$item_list[] = new Item("moxthiroEmoticon.gif");
	$item_list[] = new Item("tinExoStisi.gif", "Την έστησα.", 1.4);
	$item_list[] = new Item("tinEstisa.gif", "Την έστησα…", 4.0);
	$item_list[] = new Item("tinEstise.gif", "Την έστησε!!!");
	$item_list[] = new Item("ekplixiEmoticon.gif");
	$item_list[] = new Item("tromosEmoticon.gif");
	$item_list[] = new Item("ohMyGod.gif", "", 5.0);
	$item_list[] = new Item("aman.jpg", "", 6.6, "_AMAN_");
	$item_list[] = new Item("mavrosGourlomatis.gif", "", 5.0);
	$item_list[] = new Item("gamaPanda.jpg", "Γαμήθηκαν τα πάντα!", 6.0);
	$item_list[] = new Item("katastrofi.jpg", "", 6.6, "_GGTK_");
	$item_list[] = new Item("kota.gif", "Κότα…", 3.2);
	$item_list[] = new Item("koronaGramata.gif", "Το 'παιξα στην τύχη.", 1.0);
	$item_list[] = new Item("gemisaKapikia.gif", "Γέμισα καπίκια!");
	$item_list[] = new Item("karabinas.jpg", "", 3.8);
	$item_list[] = new Item("thaVgaloMati.gif", "Θα βγει κανένα μάτι;");
	$item_list[] = new Item("bearFace.gif", "Βγάλαμε κανένα μάτι;");
	$item_list[] = new Item("gavosEmoticon.gif", "Θα στραβωθώ ρε!");
	$item_list[] = new Item("matia.gif", "", 3.0);
	$item_list[] = new Item("aomatos.jpg", "Αόμματος!", 3.5, "_KL_");
	$item_list[] = new Item("meTrelanes.gif", "Με τρέλανες τώρα!");
	$item_list[] = new Item("efkoloItan.gif", "Όχι να το παινευτώ, αλλά είμαι μάστορας.", 2.0);
	$item_list[] = new Item("dikeoma.gif", "Δικαίωμα…");
	$item_list[] = new Item("skeptikoArkoudi.gif");
	$item_list[] = new Item("vadinSkifto.gif", "Δύσκολο…", 2.0);
	$item_list[] = new Item("denTsimpao.gif", "Δεν τσιμπάω ρε!", 2.1);
	$item_list[] = new Item("elaStoThio.gif", "Έλα στο θείο!", 3.2);
	$item_list[] = new Item("helloBird.gif", "", "", "kanarini");
	$item_list[] = new Item("piosPezi.gif", "Ε, ποιος παίζει;", 3.1);
	$item_list[] = new Item("petamaKitapi.gif", "Δες τα χάλια σου στο κιτάπι…");
	$item_list[] = new Item("noCommentEmoticon.gif");
	$item_list[] = new Item("souromenosIse.gif", "Σουρωμένος είσαι;");
	$item_list[] = new Item("tiSasExo.gif", "Τι σας έχω, τι σας έχω!");
	$item_list[] = new Item("kremastika.gif", "Κρεμάστηκα τώρα!", 3.3);
	$item_list[] = new Item("xipna.gif", "Ξύπνα, ρεεεε!", 5.1, "bell:1000");
	$item_list[] = new Item("mafalda.gif", "Παίξτο ανέμελα…");
	$item_list[] = new Item("nailbiter.gif", "", 1.2);
	$item_list[] = new Item("toraTiKano.gif", "Τώρα;", 4.0);
	$item_list[] = new Item("oniropoloEmoticon.gif", "Λες η τύχη να είναι μαζί μου;");
	$item_list[] = new Item("lesEmoticon.gif", "Λες;");
	$item_list[] = new Item("thimisouReMalaka.gif", "Χμ…");
	$item_list[] = new Item("xmEmoticon.gif");
	$item_list[] = new Item("aporiaPokemon.gif");
	$item_list[] = new Item("giatiEpexes.gif", "Γιατί έπαιξες, ρε συ;");
	$item_list[] = new Item("boukalopatos.jpg", "", 6.2);
	$item_list[] = new Item("pleaseEmoticon.gif", "Παίξε μια φορά σωστά…", 2.4);
	$item_list[] = new Item("oxiReSi.gif", "Όχι ρε Πούτιν μου…");
	$item_list[] = new Item("alithoros.jpg", "Τώρα τα είδα όλα!", 3.2);
	$item_list[] = new Item("sfiriKefali.gif");
	$item_list[] = new Item("ouranosSfontili.gif");
	$item_list[] = new Item("kinezos.gif");
	$item_list[] = new Item("snoopy.gif", "Τρέλα!", 2.0);
	$item_list[] = new Item("goofy.jpg", "Τώρα μας τρέλανες!", 4.6);
	$item_list[] = new Item("voutes.gif", "Άρχισες τις βούτες πάλι;");
	$item_list[] = new Item("vatraxos.gif", "Τζα!");
	$item_list[] = new Item("gunPenis.gif", "", 7.8);
	$item_list[] = new Item("spiderman.gif", "Παιχταράς είμαι!");
	$item_list[] = new Item("michaelJackson.gif", "Είμαι μεγάλος μάστορας!");
	$item_list[] = new Item("imeApisteftos.gif", "Είμαι απίστευτος!");
	$item_list[] = new Item("xorosSpagato.gif", "Είμαι μεγάλος παίκτης!");
	$item_list[] = new Item("imeMegalos.gif");
	$item_list[] = new Item("axtipitoDidimo.gif", "Είμαστε αχτύπητο δίδυμο!");
	$item_list[] = new Item("thankYou.gif");
	$item_list[] = new Item("cheersEmoticon.gif", "", 3.2);
	$item_list[] = new Item("mikiMaous.gif", "", 2.8);
	$item_list[] = new Item("soreos.gif", "Σωραίος…", 2.5);
	$item_list[] = new Item("trelathikaTora.gif", "Τρελάθηκα τώρα!");
	$item_list[] = new Item("etsi.gif", "Έεεεετσι!");
	$item_list[] = new Item("prosexe.gif");
	$item_list[] = new Item("epikindino.gif", "Επικίνδυνο…");
	$item_list[] = new Item("daffyMalakas.gif", "Τρόμπας είσαι;", 4.4);
	$item_list[] = new Item("malakiaSinefo.gif", "Η μαλακία πάει σύννεφο…");
	$item_list[] = new Item("toblerone.jpg", "Τον πλέρωνε…");
	$item_list[] = new Item("pexeBala.gif", "Παίξε μπάλα ρε!");
	$item_list[] = new Item("pipaKolo.gif", "Πίπα κώλο μας πάει…");
	$item_list[] = new Item("gunFail.gif", "", 7.0);
	$item_list[] = new Item("tonIpiame.gif", "Τον ήπιαμε!", 3.2);
	$item_list[] = new Item("pipaKaroto.gif", "", 3.3);
	$item_list[] = new Item("pipa.gif", "Πίπα, όπως λέμε Φελίπα…");
	$item_list[] = new Item("dontiToulipa.gif");
	$item_list[] = new Item("manoula.jpg", "Μανούλααα…", 3.5,
		"http://youtu.be/EMGNdy7gVMM");
	$item_list[] = new Item("klamaEmoticon.gif");
	$item_list[] = new Item("klapsEmoticon.gif", "Κλαψ…");
	$item_list[] = new Item("tsopaTsopa.gif", "Τσώπα, τσώπα…");
	$item_list[] = new Item("tiNaEkana.gif", "Τι να έκανα, ρε συ;", 2.0);
	$item_list[] = new Item("matakiaEnoxa.gif", "", 1.4);
	$item_list[] = new Item("kokinizo.gif");
	$item_list[] = new Item("meKitasPouSeKitao.gif", "Μήπως βγω έτσι;");
	$item_list[] = new Item("lesNaBgo.gif", "Λες να βγω;");
	$item_list[] = new Item("viziaPanoKato.gif", "Με βγάλατε!", 2.0);
	$item_list[] = new Item("vgika.gif", "Βγήκα!", 2.0);
	$item_list[] = new Item("gelioEmoticon.gif", "Πλάκα έχετε…", 1.4);
	$item_list[] = new Item("lolEmoticon.gif");
	$item_list[] = new Item("stroumfaki.gif", "Α, χα, χα, χαααα!");
	$item_list[] = new Item("haHaHa.gif");
	$item_list[] = new Item("hahahaSteno.gif", "", 3.0);
	$item_list[] = new Item("xekardismenoEmoticon.gif");
	$item_list[] = new Item("gelia.gif", "Ε, ρε γέλια που θα κάνουμε!", 3.2);
	$item_list[] = new Item("no.gif", "", 3.0);
	$item_list[] = new Item("nop.gif");
	$item_list[] = new Item("oxiOxi.gif");
	$item_list[] = new Item("meTipota.gif", "Με τίποτα!", 4.2);
	$item_list[] = new Item("alwaysSmile.gif");
	$item_list[] = new Item("vgikaPapaki.gif", "Εγώ βγήκα πάντως…");
	$item_list[] = new Item("telia.gif");
	$item_list[] = new Item("katapliktiko.gif", "Καταπληκτικό!");
	$item_list[] = new Item("ObamaClapping.gif", "Μπράβο, μπράβο…", 5.0);
	$item_list[] = new Item("palamakiaEmoticon.gif", "Παραδέχομαι…");
	$item_list[] = new Item("kino.gif");
	$item_list[] = new Item("bravoEmoticon.gif");
	$item_list[] = new Item("bingoPokemon.gif", "Σωστόοοοστ!");
	$item_list[] = new Item("isePextaras.gif", "Είσαι παιχταράς!", 1.0);
	$item_list[] = new Item("iseTerastios.gif", "Είσαι τεράστιος!");
	$item_list[] = new Item("iseTromeros.gif", "", 4.8);
	$item_list[] = new Item("ok.gif");
	$item_list[] = new Item("kalaPouMePires.gif", "Καλά που με πήρες!");
	$item_list[] = new Item("egiptiakosXoros.gif");
	$item_list[] = new Item("soldierDance.gif");
	$item_list[] = new Item("ILoveUEmoticon.gif");
	$item_list[] = new Item("filaki.gif", "Να σε φιλήσω!", "", "filaki");
	$item_list[] = new Item("iLoveYou.gif");
	$item_list[] = new Item("seLatrevo.gif", "Σε λατρεύω!");
	$item_list[] = new Item("moutsouna.gif", "", 3.1);
	$item_list[] = new Item("flower.gif");
	$item_list[] = new Item("tragoudiEmoticon.gif", "Θα μας τραγουδήσεις κάτι;");
	$item_list[] = new Item("koutsoTripa.gif", "Πρόσεχε τις λούμπες!");
	$item_list[] = new Item("minBisMesa.gif", "Ένα, δύο, τρία και… Ουπς!", "", "blioup:1500:20");
	$item_list[] = new Item("migaki.gif", "Θα φάει η μύγα σίδερο και το κουνούπι ατσάλι!");
	$item_list[] = new Item("notaraTaTheli.jpg", "Τα θέλει κι εσένα ο οργανισμός σου!", "4.0",
		"http://youtu.be/Y9fNnTZeZU4");
	$item_list[] = new Item("notaraSodoma.jpg", "Εδώ μέσα γίνονται Σόδομα και Γόμορα!", "6.0",
		"http://youtu.be/bthnzH5-4gw");
	$item_list[] = new Item("chuckNoris.jpg", "Ούτε εγώ δεν τις βγάζω αυτές!");
	$item_list[] = new Item("vegosPelates.jpg", "Πελάτες μου!", "3.5",
		"http://youtu.be/LpX2T8IenD8");
	$item_list[] = new Item("skoulikantera.jpg", "Α, πανάθεμά σε, σκουληκαντέρα!", "5.6", "_SKL_");
	$item_list[] = new Item("tinPatisame.jpg", "Την πατήσαμε…", "6.0", "_TP_");
	$item_list[] = new Item("xtipoKefali.gif");
	$item_list[] = new Item("tinExoPsonisi.gif", "Την έχω ψωνίσει τώρα!");
	$item_list[] = new Item("sfiriEmoticon.gif", "Θα το σπάσω!!!");
	$item_list[] = new Item("parathiro.gif", "", "", "tzamia:1500");
	$item_list[] = new Item("astrapesEmoticon.gif", "#!%@^&#*!@");
	$item_list[] = new Item("fuckYou.gif");
	$item_list[] = new Item("bartAss.gif", "Kiss my ass!");
	$item_list[] = new Item("denAntexo.png", "Όχι, δεν αντέχω άλλο!", "5.0",
		"http://youtu.be/aEOcb4DD6xw");
	$item_list[] = new Item("miGamiso.jpg", "", 2.0);
	$item_list[] = new Item("kokiniKarta.jpg", "", 3.0, "sfirixtra");
	$item_list[] = new Item("tiNaSouPoTora.gif", "Τι να σου πω τώρα;", 2.0);
	$item_list[] = new Item("binelikia.gif");
	$item_list[] = new Item("klotsiaArxidia.gif");
	$item_list[] = new Item("taXoni.gif");
	$item_list[] = new Item("bounidiEmoticon.gif", "Άμα σ' αρχίσω τώρα στα μπουνίδια θα φταίω;");
	$item_list[] = new Item("giatiMePires.gif", "Εγώ γιατί σε πήρα, ρε;", 1.6);
	$item_list[] = new Item("tiKanisRe.gif", "Τι έκανες, ρε;", 1.6);
	$item_list[] = new Item("marinikol.gif", "", 4.0);
	$item_list[] = new Item("limaExo.gif", "Έχω πήξει στο λιμό…", 2.8);
	$item_list[] = new Item("ouraKoutavi.gif");
	$item_list[] = new Item("prasiniGlosa.gif");
	$item_list[] = new Item("youCanDoIt.gif", "", 1.6);
	$item_list[] = new Item("tirakiEmoticon.gif", "Το τυράκι το είδες. Τη φάκα όμως;");
	$item_list[] = new Item("faka.jpg", "", 4.4);
	$item_list[] = new Item("victoryEmoticon.gif", "Με τη νίκη!", 1.0);
	$item_list[] = new Item("goodLuck.gif", "");
	$item_list[] = new Item("nistaxa.gif", "Νύσταξα, ρε σεις…");
	$item_list[] = new Item("ipnosEmoticon.gif", "Κοιμήθηκα…");
	$item_list[] = new Item("fevgoPedia.gif", "Φεύγω παιδιά!");
	$item_list[] = new Item("flag.gif", "Μοιράζω και φεύγω!", 2.4);
	$item_list[] = new Item("bye.gif");
	$item_list[] = new Item("kalimeraEmoticon.gif");
	$item_list[] = new Item("goodNight.gif");
	$item_list[] = new Item("ouranosSfontili.gif", "Ωχ!", "", "doing");
	$item_list[] = new Item("klania.gif", "Σόρι παιδιά…", "", "klania");
	$item_list[] = new Item("laptopEmoticon.gif");
	$item_list[] = new Item("piramaEmoticon.gif", "Είπα να κάνω ένα πείραμα…", 3.2);
	$item_list[] = new Item("vivlioEmoticon.gif",
		"Κάτσε να δω τι λέει ο Σαραντάκος γι αυτή την περίπτωση…");
	$item_list[] = new Item("notpps1.png", "Τα πράγματα πάνε στραβά;", 3.6, "_NOTPPS_");
	$item_list[] = new Item("logokrisia.jpg", "", 6.6);

	if ($globals->is_pektis() &&
		is_file($ufile = "user/" . $globals->pektis->login . ".php")) {
		include $ufile;
	}

	?>
	<?php
	$cnt = count($item_list);
	for ($i = 0; $i < $cnt; $i++) {
		$item_list[$i]->show();
	}
}
?>
