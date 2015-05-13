//5-13-15  JChoy Support classes for MainActivity


package com.ok88.andydev.rogherdy_h;

import java.io.*;
import java.io.InputStream;
import java.io.File;
import java.io.FileNotFoundException;
import android.content.Context;


//
// DevAid
//
public class DevAid extends Object {
	//
	// getAssetTextData
	//
	public static String getAssetTextData(Context ctx, String filename)
	throws IOException
	{
		InputStream input = ctx.getAssets().open(filename,1);
		int size = input.available();
		
		if (size>0){	
			byte[] buffer = new byte[size];
			input.read(buffer);
			input.close();

			String text = new String(buffer);
			return text;
		} 
		return null;
	}
}//class

