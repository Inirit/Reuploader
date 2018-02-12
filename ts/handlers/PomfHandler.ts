import HandlerBase from "./HandlerBase";
import HandlerType from "./HandlerType";

class PomfHandler extends HandlerBase
{
	private readonly _uploadUrl: string = "https://pomf.cat/upload.php";
	private readonly _uploadPrefix: string = "https://a.pomf.cat/";

	get HandlerType(): HandlerType
	{
		return HandlerType.Pomf;
	}

	public async HandleUpload(image: Blob): Promise<string>
	{
		const formData = new FormData();
		formData.append("files[]", image, "image.jpg");

		let uploadedUrl: string;

		await $.ajax(
			{
				url: this._uploadUrl,
				method: "POST",
				data: formData,
				cache: false,
				contentType: false,
				processData: false,
				xhr: this.GetUploadXhr
			}).then(data =>
			{
				if (data && data.files)
				{
					const uploadedFile = data.files[0];
					const uploadedFileName = uploadedFile.url;

					uploadedUrl = `${this._uploadPrefix}${uploadedFileName}`;
				}
				else
				{
					this.HandleGeneralError("Failed to upload image, unexpected response format from service.");
				}
			},
			(jqXHR, textStatus, error) =>
			{
				this.HandleUploadError(jqXHR, textStatus, error);
			});

		return uploadedUrl;
	}
}

export default PomfHandler;
