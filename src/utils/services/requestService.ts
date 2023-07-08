import {
    createRequest, deleteRequestById, RequestQueries, setStatutRequestToAccept, setStatutRequestToRefuse
} from "../../queries/request.queries";
import {Request} from "express";
import {
    getAllPlantSittingExceptRequestId, PlantSittingQueries,
    setTakenPlantSittingTrue
} from "../../queries/plantSitting.queries";
import {
    createMessageForRequest, deleteMessageWithMessageId,
    getAllMessageByBookerId
} from "../../queries/message.queries";
import {findOnePlant} from "../../queries/plant.queries";

export class RequestService{
    private plantSittingRepository: PlantSittingQueries;
    private requestRepository: RequestQueries;

    constructor() {
        this.plantSittingRepository = new PlantSittingQueries()
        this.requestRepository = new RequestQueries()
    }

    public async create(request: Request) {
        const plantSitting = await this.plantSittingRepository.findById(request.body.plantSittingId)

        const plantInfo = await findOnePlant(plantSitting.plant._id.toString())
        const receiver = plantInfo.user._id.toString()

        const newRequest = await createRequest(request.user)
        const sender = newRequest.booker._id.toString()

        await this.plantSittingRepository.linkPlantSittingToRequest(plantSitting, newRequest._id.toString())

        await createMessageForRequest(
            sender,
            receiver,
            newRequest._id.toString(),
            "Bonjour, je suis disponible pour garder votre plante"
        )
    }

    public async accept(requestId: string) {

        const plantSitting = await this.plantSittingRepository.getOneByRequestId(requestId)

        await setStatutRequestToAccept(requestId)
        await this.setOtherRequestForThisPlantSittingToRefuse(plantSitting._id.toString(), requestId)

        await setTakenPlantSittingTrue(plantSitting._id.toString())
    }

    private async setOtherRequestForThisPlantSittingToRefuse(plantSittingId: string, requestId: string) {

        const temp = await getAllPlantSittingExceptRequestId(plantSittingId, requestId)

        for(let i = 0; i < temp[0].requests.length; i++){
            if(temp[0].requests.length !== 0){
                await setStatutRequestToRefuse(temp[0].requests[i]._id.toString())
            }
        }
    }

    public async refuse(requestId: string){
        await this.requestRepository.findById(requestId)
        await setStatutRequestToRefuse(requestId)
    }

    public async delete(requestId: string){

        await this.deleteBookerMessages(requestId)

        await this.plantSittingRepository.rollBack(requestId)

        await deleteRequestById(requestId)

    }

    private async deleteBookerMessages(requestId: string){
        const request = await this.requestRepository.findById(requestId)
        const allMessageInfo = await getAllMessageByBookerId(request.booker._id.toString())

        for(let i = 0; i < allMessageInfo.length; i++){

            await deleteMessageWithMessageId(allMessageInfo[i]._id)

        }
    }

}