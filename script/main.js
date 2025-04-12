title = document.getElementById('title')

stihi = document.getElementsByClassName('stih')

array = []
for (i = 0; i < stihi.length; ++i)
	array.push([stihi[i].offsetTop, stihi[i].firstElementChild.innerText])

function changeTitle() {
	offset = window.scrollY
	if (offset < 100) {
		title.innerText = 'Алине.ру'
		return
	}
	for (i = array.length - 1; i >= 0; --i)
		if (array[i][0] - 50 <= offset) {
			title.innerText = array[i][1]
			break
		}
}

onscroll = changeTitle;
onload = changeTitle;
