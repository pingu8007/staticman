<!doctype html>
<html>

<head>
	<style>
		p {
			word-break: break-all;
			font-family: 'Courier New', Courier, monospace;
			border: burlywood;
			border-style: solid;
			border-radius: 8px;
			padding: 3px 8px;
		}
	</style>
</head>

<body>
	<p>${ d.success ? d.data : d.message }</p>
	<script>
		var raw = '${ d.raw }';
		var target = '${ d.target ? d.target : "" }';
		if (!target) {
			console.info("postMessage disabled")
		} else if (!window.opener) {
			console.info("parent window not found")
		} else {
			window.opener.postMessage(raw, target)
		}
	</script>
</body>

</html>