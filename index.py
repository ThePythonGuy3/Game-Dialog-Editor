from os import walk
import shutil

def run():
	path = "..\\Acerola_Jam_Real\\resources\\characters"

	try:
		shutil.rmtree("./resources")
	except:
		pass
	
	shutil.copytree(path, "./resources/characters")
				 
	res = []
	for (dir_path, dir_names, file_names) in walk(path):
		j = 0
		for i in file_names:
			if i.endswith(".png"):
				res.append(dir_path + "\\" + i)
	c = ";".join(res)

	f = open("indexed.txt", "w+")
	f.write(c.replace("\\", "/").replace("./Acerola_Jam_Real", ""))
	f.close()

	print(c)